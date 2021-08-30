export enum Tile {
    Grass = 0,
    // Flower,
    Water,
    Rock,
    Dirt,
    WetDirt,
    Sand,
    Count,
}

const TileOffset: { [key in Tile]: [number, number] } = {
    [Tile.Grass]: [0, 0],
    // [Tile.Flower]: [3, 0],
    [Tile.Water]: [4, 1],
    [Tile.Rock]: [0, 13],
    [Tile.Dirt]: [0, 4],
    [Tile.WetDirt]: [0, 3],
    [Tile.Sand]: [0, 2],
    [Tile.Count]: [-1, -1],
};

export class TileHelper {
    private tile_size = 32;
    private image = new Image();

    constructor() {
        this.image.src = './images/terrain.png';
    }

    draw(ctx: CanvasRenderingContext2D, tile: Tile, x: number, y: number) {
        const offset = TileOffset[tile];

        ctx.drawImage(
            this.image, 
            offset[0] * this.tile_size, 
            offset[1] * this.tile_size, 
            this.tile_size, 
            this.tile_size,
            x * this.tile_size,
            y * this.tile_size,
            this.tile_size,
            this.tile_size
        );
    }
}
