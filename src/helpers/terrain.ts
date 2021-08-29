import TileType from '../constants/tile_type';
import Material from '../constants/material';

export default class TerrainHelper {
    tilesize = 32;
    ready: Promise<void[]>;

    #terrain = new Image();

    constructor() {
        this.ready = Promise.all([
            this.load(this.#terrain, './images/terrain.png')
        ])
    }

    load(image: HTMLImageElement, source: string) {
        return new Promise<void>((resolve, reject) => {
            image.src = source;
            image.onload = () => {
                resolve();
            }
            image.onerror = (err) => {
                reject(err);
            }
        });
    }

    drawOffset(context: CanvasRenderingContext2D, dx: number, dy: number, offset: [number, number]) {
        context.drawImage(this.#terrain, 
                        offset[0] * this.tilesize, 
                        offset[1] * this.tilesize, 
                        this.tilesize, 
                        this.tilesize,
                        dx,
                        dy,
                        this.tilesize,
                        this.tilesize);
    }

    draw(context: CanvasRenderingContext2D, type: TileType, x: number, y: number) {
        this.drawOffset(context, 
                        x * this.tilesize,
                        y * this.tilesize,
                        Material[type].offset_basic);
    }
};
