export enum Occupant {
    None = 0,
    WheatSeed,
    WheatSprout,
    WheatGrowing,
    Wheat,
    Flower,
    Stump,
    Tree,
    Stone,
    Rock,
    Tiki,
    Reeds1,
    Reeds2,
    Mushroom,
    Pillar,
    Invis,
    Marble,
    Lilypad,
    CornStalk,
    Cross,
    Cactus,
    Log,
    Droplet,
    Kill,
};

type OccupantInfo = {
    block: number;
    offset: [number, number];
    size?: [number, number];
    anchor?: [number, number]
}

const OccupantData : { [key in Occupant]: OccupantInfo } = {
    [Occupant.None]:            { block: 0, offset: [-1,-1] },
    [Occupant.WheatSeed]:       { block: 0, offset: [0, 0] },
    [Occupant.WheatSprout]:     { block: 0, offset: [1, 0] },
    [Occupant.WheatGrowing]:    { block: 0, offset: [2, 0] },
    [Occupant.Wheat]:           { block: 1, offset: [3, 0], size: [1, 2] },
    [Occupant.Stump]:           { block: 0, offset: [7, 0] },
    [Occupant.Tree]:            { block: 1, offset: [4, 0], size: [3, 5], anchor: [1, 1] },
    [Occupant.Stone]:           { block: 2, offset: [2, 2], size: [2, 2] },
    [Occupant.Rock]:            { block: 1, offset: [2, 1] },
    [Occupant.Tiki]:            { block: 2, offset: [0, 1], size: [2, 3] },
    [Occupant.Reeds1]:          { block: 1, offset: [0, 4], size: [1, 3] },
    [Occupant.Reeds2]:          { block: 1, offset: [0, 4], size: [1, 3] },
    [Occupant.Mushroom]:        { block: 0, offset: [1, 4] },
    [Occupant.Pillar]:          { block: 1, offset: [2, 4], size: [1, 3] },
    [Occupant.Invis]:           { block: 1, offset: [-1,-1] },
    [Occupant.Marble]:          { block: 1, offset: [1, 5] },
    [Occupant.Lilypad]:         { block: 0, offset: [1, 6] },
    [Occupant.CornStalk]:       { block: 1, offset: [4, 5], size: [1, 2] },
    [Occupant.Cross]:           { block: 1, offset: [5, 5], size: [1, 2] },
    [Occupant.Cactus]:          { block: 2, offset: [6, 5], size: [2, 2] },
    [Occupant.Log]:             { block: 0, offset: [7, 1] },
    [Occupant.Droplet]:         { block: 0, offset: [7, 2] },
    [Occupant.Flower]:          { block: 1, offset: [7, 3] },
    [Occupant.Kill]:            { block: 0, offset: [7, 4] },
};

export class OccupantHelper {
    private tile_size = 32;
    private image = new Image();

    constructor() {
        this.image.src = './images/occupants.png';
    }

    private drawOffset(context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, offset: [number, number]) {
        context.drawImage(
            this.image,
            offset[0] * this.tile_size,
            offset[1] * this.tile_size,
            width * this.tile_size,
            height * this.tile_size,
            x,
            y,
            width * this.tile_size,
            height * this.tile_size
        );
    }

    draw(ctx: CanvasRenderingContext2D, occupant: Occupant, x: number, y: number) {
        if (occupant == Occupant.Invis || occupant == Occupant.None) {
            return;
        }

        const {
            offset,
            size = [1, 1],
            anchor = [0, 0],
        } = OccupantData[occupant];

        const dx = (x - anchor[0]) * this.tile_size;
        const dy = (y + 1 + anchor[1] - size[1]) * this.tile_size;

        this.drawOffset(ctx, dx, dy, size[0], size[1], offset);
    }
}
