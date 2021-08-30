import {
    Point,
} from "../../lib/juicy";
import { Occupant } from "../helpers/occupant";
import Level, { Option } from "./level";
import { LevelData, Levels, ModalFunction } from "../levels/level_data";
import { Tile } from "../helpers/tile";

export default class SandboxLevel extends Level {
    constructor() {
        super(1, new Point(15));

        this.name.set({ text: 'Sandbox' });
    }

    fillMap() {
        this.expectedTiles = [];
        this.expectedOcpts = [];
    }

    getOptions(): Option[] {
        return [
            {
                type: 'Tile',
                value: Tile.Grass,
                count: 100
            },
            {
                type: 'Tile',
                value: Tile.Water,
                count: 100
            },
            {
                type: 'Tile',
                value: Tile.Rock,
                count: 100
            },
            {
                type: 'Occupant',
                value: Occupant.Flower,
                count: 100
            },
            {
                type: 'Tile',
                value: Tile.Dirt,
                count: 100
            },
            {
                type: 'Tile',
                value: Tile.WetDirt,
                count: 100
            },
            {
                type: 'Tile',
                value: Tile.Sand,
                count: 100
            },
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            {
                type: 'Occupant',
                value: Occupant.Pillar,
                count: 100
            },
            {
                type: 'Occupant',
                value: Occupant.Tree,
                count: 100
            },
            {
                type: 'Occupant',
                value: Occupant.WheatSeed,
                count: 100
            },
            {
                type: 'Occupant',
                value: Occupant.Droplet,
                count: 100
            },
        ];
    }

    nextPuzzle() {
    }
};
