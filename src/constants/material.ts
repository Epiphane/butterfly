import TileType from './tile_type';

type Material = {
    offset_basic: [number, number];
    offset_above: [number, number];
    offset_below?: [number, number];
    pixel: [number, number, number, number];
    grade?: number;
}

export default {
    [TileType.Grass]: {
        offset_basic: [0,  0],
        offset_above: [6,  0],
        pixel: [47, 129, 54, 255],
        grade: 50
    },
    [TileType.Sand]: {
        offset_basic: [0,  2],
        offset_above: [6,  8],
        pixel: [218, 215, 52, 255],
        grade: 100
    },
    [TileType.Water]: {
        offset_basic: [0,  1],
        offset_above: [18, 0],
        offset_below: [10, 0],
        pixel: [21, 108, 153, 255],
        grade: 100
    },
    [TileType.Dirt]: {
        offset_basic: [0,  4],
        offset_above: [6,  4],
        pixel: [129, 92, 28, 255]
    },
    [TileType.Soil]: {
        offset_basic: [0,  5],
        offset_above: [10, 4],
        pixel: [100, 80, 18, 255]
    },
    [TileType.WetSoil]: {
        offset_basic: [0,  6],
        offset_above: [10, 8],
        pixel: [100, 80, 18, 255]
    },
    [TileType.Snow]: {
        offset_basic: [0, 10],
        offset_above: [14, 4],
        pixel: [255, 255, 255, 255],
        grade: 7
    },
    [TileType.Stone]: {
        offset_basic: [0, 13],
        offset_above: [6, 12],
        pixel: [128, 128, 128, 255]
    },
    [TileType.Ice]: {
        offset_basic: [0, 14],
        offset_above: [10, 12],
        pixel: [176, 242, 255, 255]
    }
} as { [key: number]: Material };
