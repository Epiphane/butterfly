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
                type: 'Tile',
                value: Tile.Flower,
                count: 100
            },
        ];
    }

    nextPuzzle() {
    }
};
