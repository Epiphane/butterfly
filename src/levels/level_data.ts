import { Point } from "../../lib/juicy"
import { Occupant } from "../helpers/occupant"
import { Tile, TileHelper } from "../helpers/tile";
import { Option } from "../states/level"

export type ModalFunction = (ctx: CanvasRenderingContext2D, width: number, height: number) => void;

export type LevelData = {
    initialTiles?: Tile[][],
    initialOcpts?: Occupant[][],
    expectedTiles?: Tile[][],
    expectedOcpts?: Occupant[][],
    size?: Point,
    scale?: number,
    options: Option[],
    modal?: ModalFunction;
}

function WriteCentered(ctx: CanvasRenderingContext2D, text: string, x: number, y: number) {
    const size = ctx.measureText(text);
    ctx.fillText(text, x - size.width / 2, y);
}

const tiles = new TileHelper();

export const Levels: LevelData[] = [
    {
        expectedTiles: [
            [Tile.Grass, Tile.Rock, Tile.Grass],
        ],
        size: new Point(3, 1),
        scale: 6,
        options: [
            {
                type: 'Tile',
                value: Tile.Rock,
                count: 1,
            },
        ],
        modal: (ctx: CanvasRenderingContext2D, width: number, height: number) => {
            ctx.fillStyle = 'white';
            ctx.font = '48px Poiret One';
            WriteCentered(ctx, 'Level 1', width / 2, 60);

            ctx.font = '32px Poiret One';
            WriteCentered(ctx, 'Goal: Terraform your world', width / 2, 120)
            WriteCentered(ctx, 'to match the expected map', width / 2, 160);

            ctx.imageSmoothingEnabled = false;
            ctx.save();
            ctx.translate(20, 200);
            ctx.scale(3, 3);
            tiles.draw(ctx, Tile.Grass, 0, 0);
            tiles.draw(ctx, Tile.Grass, 1, 0);
            tiles.draw(ctx, Tile.Grass, 2, 0);

            WriteCentered(ctx, '-> ', width / 6 - 2, 30);

            tiles.draw(ctx, Tile.Grass, 4, 0);
            tiles.draw(ctx, Tile.Rock, 5, 0);
            tiles.draw(ctx, Tile.Grass, 6, 0);
            ctx.restore();

            WriteCentered(ctx, 'Use tiles from the Options panel', width / 2, 380);
            WriteCentered(ctx, 'Click advance to check your work', width / 2, 420);
        }
    },
    {
        expectedTiles: [
            [Tile.Water, Tile.Flower],
        ],
        size: new Point(2, 1),
        scale: 6,
        options: [
            {
                type: 'Tile',
                value: Tile.Water,
                count: 1
            },
        ],
        modal: (ctx: CanvasRenderingContext2D, width: number, height: number) => {
            ctx.fillStyle = 'white';
            ctx.font = '48px Poiret One';
            WriteCentered(ctx, 'Level 2', width / 2, 60);

            ctx.font = '32px Poiret One';
            WriteCentered(ctx, 'Sometimes, you have to let', width / 2, 120)
            WriteCentered(ctx, 'nature work its magic', width / 2, 160);

            ctx.imageSmoothingEnabled = false;
            ctx.save();
            ctx.translate(20, 200);
            ctx.scale(3, 3);
            tiles.draw(ctx, Tile.Water, 0, 0);
            tiles.draw(ctx, Tile.Grass, 1, 0);

            ctx.font = '16px Poiret One';
            WriteCentered(ctx, '-(advance)> ', width / 6 - 5, 20);

            tiles.draw(ctx, Tile.Water, 5, 0);
            tiles.draw(ctx, Tile.Flower, 6, 0);
            ctx.restore();
        }
    },
    {
        expectedTiles: [
            [Tile.Flower, Tile.Grass, Tile.Flower],
            [Tile.Grass, Tile.Water, Tile.Grass],
            [Tile.Flower, Tile.Grass, Tile.Flower],
        ],
        size: new Point(3),
        scale: 5,
        options: [
            {
                type: 'Tile',
                value: Tile.Water,
                count: 1
            }
        ],
        modal: (ctx: CanvasRenderingContext2D, width: number, height: number) => {
            ctx.fillStyle = 'white';
            ctx.font = '48px Poiret One';
            WriteCentered(ctx, 'Level 3', width / 2, 60);

            ctx.font = '32px Poiret One';
            WriteCentered(ctx, 'Flowers die without water, and', width / 2, 120)
            WriteCentered(ctx, 'if they are too crowded', width / 2, 160);

            ctx.imageSmoothingEnabled = false;
            ctx.save();
            ctx.translate(120, 200);
            ctx.scale(2, 2);
            tiles.draw(ctx, Tile.Flower, 0, 0);
            tiles.draw(ctx, Tile.Flower, 1, 0);
            tiles.draw(ctx, Tile.Water, 0, 1);
            tiles.draw(ctx, Tile.Flower, 1, 1);
            tiles.draw(ctx, Tile.Flower, 0, 2);
            tiles.draw(ctx, Tile.Flower, 1, 2);

            ctx.font = '16px Poiret One';
            WriteCentered(ctx, '-> ', width / 6 - 2, 120);

            tiles.draw(ctx, Tile.Grass, 5, 0);
            tiles.draw(ctx, Tile.Flower, 6, 0);
            tiles.draw(ctx, Tile.Water, 5, 1);
            tiles.draw(ctx, Tile.Grass, 6, 1);
            tiles.draw(ctx, Tile.Grass, 5, 2);
            tiles.draw(ctx, Tile.Flower, 6, 2);
            ctx.restore();
        }
    },
    {
        expectedTiles: [
            [Tile.Flower, Tile.Grass, Tile.Flower],
            [Tile.Flower, Tile.Water, Tile.Flower],
            [Tile.Flower, Tile.Grass, Tile.Flower],
        ],
        size: new Point(3),
        scale: 5,
        options: [
            {
                type: 'Tile',
                value: Tile.Water,
                count: 1
            },
            {
                type: 'Tile',
                value: Tile.Grass,
                count: 1
            },
        ],
    },
];
