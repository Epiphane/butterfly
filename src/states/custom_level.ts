import {
    Point,
} from "../../lib/juicy";
import { Occupant } from "../helpers/occupant";
import Level, { Option } from "./level";
import { LevelData, Levels, ModalFunction } from "../levels/level_data";
import SandboxLevel from "./sandbox";

export default class CustomLevel extends Level {
    level: number;
    data: LevelData;

    constructor(level: number) {
        const data = Levels[level];
        super(data.scale || 1, data.size || new Point(10));

        this.level = level;
        this.data = data;
    }

    fillMap() {
        if (this.data.expectedTiles) {
            this.expectedTiles = this.data.expectedTiles;
        }

        this.expectedOcpts = 
            new Array(this.size.y).fill(false).map(() => 
            new Array(this.size.x).fill(Occupant.None));
    }

    getOptions(): Option[] {
        return this.data.options;
    }

    getModal(): ModalFunction | undefined {
        return this.data.modal;
    }

    nextPuzzle() {
        if (this.level < Levels.length - 1) {
            this.game.setState(new CustomLevel(this.level + 1));
        }
        else {
            this.game.setState(new SandboxLevel());
        }
    }
};
