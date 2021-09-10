import {
    Entity,
    Game,
    State,
    TextComponent,
    BoxComponent,
    Point,
} from "../../lib/juicy";
import { ButtonComponent } from "../components/button";
import { Occupant, OccupantHelper } from "../helpers/occupant";
import { Tile, TileHelper } from "../helpers/tile";
import { ModalFunction } from "../levels/level_data";

export type Option = {
    type: 'Tile' | 'Occupant';
    value: Tile | Occupant;
    count: number;
} | undefined;

export default class Level extends State {
    tileHelper = new TileHelper();
    occupantHelper = new OccupantHelper();
    tiles!: Tile[][];
    ocpts!: Occupant[][];

    expectedTiles: Tile[][];
    expectedOcpts: Occupant[][];

    private tile_size = 32;

    protected name: TextComponent
    protected scale: number;
    protected size: Point;

    private done = false;

    options_root = new Point(625, 400);
    options: Entity[] = [];
    selectedOption: number = -1;

    counter = new Entity(this, 'Counter', [TextComponent]);
    gen = 0;

    modal?: HTMLCanvasElement;

    constructor(scale: number, size: Point) {
        super();

        this.scale = scale;
        this.size = size;
        this.expectedTiles = new Array(this.size.y).fill(false).map(() => 
                    new Array(this.size.x).fill(Tile.Grass));
        this.expectedOcpts = new Array(this.size.y).fill(false).map(() => 
                        new Array(this.size.x).fill(Occupant.None));

        const title = new Entity(this, 'Name', [TextComponent]);
        this.name = title.get(TextComponent)!;
        this.name.set({
            font: 'Poiret One',
            size: 48,
            text: ' ',
        });

        const skip = new Entity(this, 'Skip', [ButtonComponent, BoxComponent, TextComponent]);
        skip.get(TextComponent)?.set({
            font: 'Poiret One',
            size: 32,
            padding: new Point(20, 10),
            text: 'Skip'
        });
        skip.get(BoxComponent)?.setFillStyle('#aa0000');
        skip.get(ButtonComponent)?.onClick(() => this.nextPuzzle());
        skip.position.x = 20;
        skip.position.y = this.game.size.y - skip.height - 20;

        this.counter.position.y = 80;
        this.counter.get(TextComponent)?.set({
            font: 'Poiret One',
            size: 16,
            text: 'Gen 0'
        })

        const reset = new Entity(this, 'Reset Button', [ButtonComponent, BoxComponent, TextComponent]);
        reset.get(TextComponent)?.set({
            font: 'Poiret One',
            size: 32,
            padding: new Point(20, 10),
            text: 'Reset'
        });
        reset.get(BoxComponent)?.setFillStyle('#aa0000');
        reset.get(ButtonComponent)?.onClick(() => this.reset());
        reset.position.x = this.game.size.x - reset.width - 20;
        reset.position.y = 80;
    }

    init() {
        const expectedHeader = new Entity(this, 'Expected', [TextComponent]);
        expectedHeader.get(TextComponent)?.set({
            font: 'Poiret One',
            size: 32,
            fillStyle: 'white',
            text: 'Expected'
        }).then(() => {
            expectedHeader.position.x = this.game.size.x - expectedHeader.width - 40;
            expectedHeader.position.y = 150;
        });

        const optionsHeader = new Entity(this, 'Options', [TextComponent]);
        optionsHeader.get(TextComponent)?.set({
            font: 'Poiret One',
            size: 32,
            fillStyle: 'white',
            text: 'Options'
        }).then(() => {
            optionsHeader.position.x = this.game.size.x - optionsHeader.width - 40;
            optionsHeader.position.y = 350;
        });

        this.reset();

        const modal = this.getModal();
        if (modal) {
            this.modal = document.createElement('canvas');
            this.modal.width = this.game.size.x - 80;
            this.modal.height = this.game.size.y - 80;
            const modalContext = this.modal.getContext('2d')!;
            modalContext.fillStyle = '#555'
            modalContext.fillRect(0, 0, this.modal.width, this.modal.height);
            modalContext.fillStyle = '#888'
            modalContext.fillRect(2, 2, this.modal.width - 4, this.modal.height - 4);
            modal(modalContext, this.modal.width, this.modal.height);

            const closeButton = new Entity(this, 'Close modal', [ButtonComponent, BoxComponent, TextComponent]);
            closeButton.get(BoxComponent)?.setFillStyle('#00aa00');
            closeButton.get(TextComponent)?.set({
                font: 'Poiret One',
                text: 'Close',
                size: 32,
                padding: new Point(20, 10),
            }).then(() => {
                closeButton.position.x = (this.game.size.x - closeButton.width) / 2;
                closeButton.position.y = this.game.size.y - closeButton.height - 60;
            });
            closeButton.get(ButtonComponent)?.onClick(() => {
                this.modal = undefined;
                this.remove(closeButton);
            })
        }
    }

    reset() {
        this.done = false;
        this.remove('Advance Button');
        this.remove('Next Puzzle');
        const button = new Entity(this, 'Advance Button', [ButtonComponent, BoxComponent, TextComponent]);
        button.get(TextComponent)?.set({
            font: 'Poiret One',
            size: 32,
            padding: new Point(20, 10),
            text: 'Advance'
        });
        button.get(BoxComponent)?.setFillStyle('#00aa00');
        button.get(ButtonComponent)?.onClick(() => this.advance());
        button.position.x = this.game.size.x - button.width - 20;
        button.position.y = 20;
        this.counter.position.x = button.position.x;

        this.selectedOption = -1;
        this.tiles = new Array(this.size.y).fill(false).map(() => 
                    new Array(this.size.x).fill(Tile.Grass));
        this.ocpts = new Array(this.size.y).fill(false).map(() => 
                        new Array(this.size.x).fill(Occupant.None));

        this.gen = 0;
        this.counter.get(TextComponent)?.set({ text: 'Gen 0' });

        this.fillMap();

        this.options.forEach(e => this.remove(e));
        this.options = [];

        const options = this.getOptions();
        options.forEach((option, i) => {
            const entity = new Entity(this, `Option ${i}`, [ButtonComponent]);
            entity.position.x = this.options_root.x + (i * 1.25) * this.tile_size;
            entity.position.y = this.options_root.y + (i * 1.5) * this.tile_size;
            entity.width = this.tile_size;
            entity.height = this.tile_size;
            entity.props = { ...option };

            entity.get(ButtonComponent)?.onClick(() => {
                if (entity.props.count > 0) {
                    this.selectedOption = i;
                }
            });

            this.options.push(entity);
        });
    }

    fillMap() {}

    getOptions(): Option[] {
        return [];
    }

    getModal(): ModalFunction | undefined {
        return undefined;
    }

    update(dt: number) {
        super.update(dt);

        this.options.forEach((opt, i) => {
            const x = i % 4;
            const y = Math.floor(i / 4);
            opt.position.x = this.options_root.x + (x * 1.25) * this.tile_size;
            opt.position.y = this.options_root.y + (y * 1.5) * this.tile_size;
        })
    }

    click(pos: Point) {
        super.click(pos);

        const tileX = Math.floor(pos.x / (this.tile_size * this.scale));
        const tileY = Math.floor((pos.y - 50) / (this.tile_size * this.scale));
        if (
            this.selectedOption >= 0 &&
            tileX >= 0 &&
            tileY >= 0 &&
            tileX < this.size.x &&
            tileY < this.size.y
        ) {
            const option = this.options[this.selectedOption].props as Option;
            if (option) {
                if (option.type === 'Tile') {
                    this.tiles[tileY][tileX] = option.value as Tile;
                }
                else {
                    if (option.value === Occupant.Kill) {
                        this.ocpts[tileY][tileX] = Occupant.None;
                    }
                    else {
                        this.ocpts[tileY][tileX] = option.value as Occupant;
                    }
                }

                option.count--;
                if (option.count === 0) {
                    this.selectedOption = -1;
                }
            }
        }
    }

    tileAt(x: number, y: number) {
        if (x < 0 || y < 0 || x >= this.size.x || y >= this.size.y) {
            return Tile.Rock;
        }

        return this.tiles[y][x];
    }

    ocptAt(x: number, y: number) {
        if (x < 0 || y < 0 || x >= this.size.x || y >= this.size.y) {
            return Occupant.None;
        }

        return this.ocpts[y][x];
    }

    step(x: number, y: number): [Tile, Occupant] {
        const thisTile = this.tileAt(x, y);
        const thisOcpt = this.ocptAt(x, y);

        let tileSums: { [key: number]: number } = {};
        for (let key in Tile) {
            if (!isNaN(Number(key))) {
                tileSums[key] = 0;
            }
        }
        let directTileSums = { ...tileSums };

        let ocptSums: { [key: number]: number } = {};
        for (let key in Occupant) {
            if (!isNaN(Number(key))) {
                ocptSums[key] = 0;
            }
        }
        let directOcptSums = { ...ocptSums };

        for (let i = x - 1; i <= x + 1; i++) {
            for (let j = y - 1; j <= y + 1; j++) {
                if (i === x && j === y) continue;

                tileSums[this.tileAt(i, j)]++;
                ocptSums[this.ocptAt(i, j)]++;

                if (i === x || j === y) {
                    directTileSums[this.tileAt(i, j)]++;
                    directOcptSums[this.ocptAt(i, j)]++;
                }
            }
        }

        // const wheaties = 
        //     directOcptSums[Occupant.WheatSeed] +
        //     directOcptSums[Occupant.WheatSprout] + 
        //     directOcptSums[Occupant.WheatGrowing] + 
        //     directOcptSums[Occupant.Wheat];

        switch (thisTile) {
            case Tile.Grass:
                if (tileSums[Tile.Sand] > 0) {
                    return [Tile.Dirt, thisOcpt];
                }

                switch (thisOcpt) {
                    case Occupant.None:
                        if (
                            (tileSums[Tile.Water] > 0 && ocptSums[Occupant.Flower] < 3)// ||
                            // ocptSums[Occupant.Flower] === 3
                        ) {
                            return [thisTile, Occupant.Flower];
                        }
                        break;
                    case Occupant.Flower:
                        if (tileSums[Tile.Water] === 0 ||
                            (ocptSums[Occupant.Flower] > 3)) {//} || (ocptSums[Occupant.Flower] + tileSums[Tile.Water]) < 2)) {
                            return [thisTile, Occupant.None];
                        }
                        break;
                    default:
                        return [thisTile, Occupant.None];
                }
                break;

            case Tile.Water:
                return [thisTile, Occupant.None];
                break;

            case Tile.Rock:
                return [thisTile, Occupant.None];
                break;

            case Tile.Dirt:
                if (tileSums[Tile.Water] + tileSums[Tile.WetDirt] > 0) {
                    return [Tile.WetDirt, thisOcpt];
                }

                switch (thisOcpt) {
                    case Occupant.Droplet:
                        return [Tile.WetDirt, Occupant.None];
                    default:
                        return [thisTile, Occupant.None];
                }

                break;

            case Tile.WetDirt:
                if (tileSums[Tile.Water] + tileSums[Tile.WetDirt] === 0) {
                    return [Tile.Dirt, thisOcpt];
                }

                switch (thisOcpt) {
                    case Occupant.None:
                        if (ocptSums[Occupant.Flower] > 0) {
                            return [thisTile, Occupant.Flower];
                        }
                        break;
                    case Occupant.Flower:
                        return [thisTile, Occupant.Flower];
                    default:
                        return [thisTile, Occupant.None];
                }
                break;

            case Tile.Sand:
                return [thisTile, Occupant.None];
                break;
                
        }

        // switch (thisOcpt) {
        // case Occupant.None:
        //     break;
        // case Occupant.Flower:
        //     if (![Tile.Grass, Tile.WetDirt].includes(thisTile)) {
        //         return [thisTile, Occupant.None];
        //     }
        //     else if (
        //         thisTile === Tile.Grass && 
        //         directTileSums[Tile.Water] === 0 &&
        //         ocptSums[Occupant.Flower] > 1
        //     ) {
        //         return [thisTile, Occupant.None];
        //     }
        //     break;
        // case Occupant.Stump:
        // case Occupant.Tree:
        // case Occupant.Stone:
        // case Occupant.Rock:
        // case Occupant.Tiki:
        // case Occupant.Reeds1:
        // case Occupant.Reeds2:
        // case Occupant.Mushroom:
        // case Occupant.Pillar:
        // case Occupant.Invis:
        // case Occupant.Marble:
        // case Occupant.Lilypad:
        // case Occupant.CornStalk:
        // case Occupant.Cactus:
        // case Occupant.Droplet:
        //     return [thisTile, Occupant.None];
        // case Occupant.Cross:
        // case Occupant.Log:
        // default:
        //     break;
        // }

        return [thisTile, thisOcpt];
    }

    advance() {
        if (this.done) {
            return;
        }

        const newTiles = this.tiles.map(r => r.map(t => t));
        const newOcpts = this.ocpts.map(r => r.map(o => o));

        let match = true;
        for (let x = 0; x < this.size.x; x++) {
            for (let y = 0; y < this.size.y; y++) {
                [
                    newTiles[y][x],
                    newOcpts[y][x]
                ] = this.step(x, y);

                if (y >= this.expectedTiles.length ||
                    x >= this.expectedTiles[y].length ||
                    newTiles[y][x] !== this.expectedTiles[y][x] ||
                    newOcpts[y][x] !== this.expectedOcpts[y][x]
                ) {
                    match = false;
                }
            }
        }

        this.tiles = newTiles;
        this.ocpts = newOcpts;

        if (match) {
            this.win();
        }

        this.counter.get(TextComponent)?.set({
            text: `Gen ${++this.gen}`
        });
    }

    win() {
        this.done = true;

        this.remove('Advance Button');

        const button = new Entity(this, 'Next Puzzle', [ButtonComponent, BoxComponent, TextComponent]);
        button.get(TextComponent)?.set({
            font: 'Poiret One',
            size: 32,
            padding: new Point(20, 10),
            text: 'Next Puzzle'
        });
        button.get(BoxComponent)?.setFillStyle('#00aa00');
        button.get(ButtonComponent)?.onClick(() => this.nextPuzzle());
        button.position.x = (this.game.size.x - button.width) / 2;
        button.position.y = this.game.size.y - button.height - 20;
    }

    nextPuzzle() {}

    render(context: CanvasRenderingContext2D, width: number, height: number) {
        super.render(context, width, height);

        // Draw the expected result
        context.save();

        let half_size = this.size.x * this.tile_size / 2;

        context.translate(700 - half_size, 200);
        this.expectedTiles.forEach((row, y) => 
            row.forEach((tile, x) => {
                this.tileHelper.draw(context, tile, x, y);
            })
        );

        this.expectedOcpts.forEach((row, y) => row.forEach((obj, x) =>
            this.occupantHelper.draw(context, obj, x, y)));

        context.restore();

        // Draw the board
        context.imageSmoothingEnabled = false;
        context.save();
        context.translate(0, 50);
        context.scale(this.scale, this.scale);
        this.tiles.forEach((row, y) => 
            row.forEach((tile, x) => {
                this.tileHelper.draw(context, tile, x, y);
            })
        );

        this.ocpts.forEach((row, y) => row.forEach((obj, x) =>
            this.occupantHelper.draw(context, obj, x, y)));
        context.restore();

        // Draw options
        context.save();
        context.translate(this.options_root.x, this.options_root.y);
        this.options.forEach((option, i) => {
            if (!option.props.type) {
                return;
            }

            const x = (i % 4) * 1.25;
            const y = Math.floor(i / 4) * 1.5;

            if (option.props.type === 'Tile') {
                this.tileHelper.draw(context, option.props.value as Tile, x, y);
            }
            else {
                this.occupantHelper.draw(context, option.props.value as Occupant, x, y);
            }

            context.font = '24px Poiret One';
            context.fillStyle = 'white'
            context.fillText(`x${option.props.count}`, x * this.tile_size, (y + 1) * this.tile_size);
        });
        context.restore();

        context.save()
        if (this.selectedOption >= 0) {
            const option = this.options[this.selectedOption].props as Option;
            if (option) {

                const tileX = Math.floor(this.game.mouse.x / (this.tile_size * this.scale));
                const tileY = Math.floor((this.game.mouse.y - 50) / (this.tile_size * this.scale));
                if (tileX >= 0 &&
                    tileY >= 0 &&
                    tileX < this.size.x &&
                    tileY < this.size.y
                ) {
                    context.save();
                    context.translate(0, 50);
                    context.scale(this.scale, this.scale);
                    if (option.type === 'Tile') {
                        this.tileHelper.draw(
                            context,
                            option.value as Tile,
                            tileX,
                            tileY
                        );
                    }
                    else {
                        this.occupantHelper.draw(
                            context,
                            option.value as Occupant,
                            tileX,
                            tileY
                        );
                    }
                    context.restore();
                }
                else {
                    if (option.type === 'Tile') {
                        this.tileHelper.draw(
                            context,
                            option.value as Tile,
                            this.game.mouse.x / this.tile_size,
                            this.game.mouse.y / this.tile_size
                        );
                    }
                    else {
                        this.occupantHelper.draw(
                            context,
                            option.value as Occupant,
                            this.game.mouse.x / this.tile_size,
                            this.game.mouse.y / this.tile_size
                        );
                    }
                }
            }
        }

        if (this.modal) {
            // const modal = this.getModal();
            // if (modal) {
            //     this.modal = document.createElement('canvas');
            //     const modalContext = this.modal.getContext('2d')!;
            //     modalContext.fillStyle = '#555';
            //     modalContext.fillRect(0, 0, this.modal.width, this.modal.height);
            //     modal(modalContext, this.modal.width, this.modal.height);
            // }
            context.drawImage(this.modal, 40, 40);

            this.get('Close modal')?.render(context);
        }
    }
};
