import { State } from "../../lib/juicy";
import CustomLevel from "./custom_level";
import SandboxLevel from "./sandbox";

export default class GameScreen extends State {
    init() {
        this.game.setState(new CustomLevel(0));
        // this.game.setState(new SandboxLevel());
    }
};
