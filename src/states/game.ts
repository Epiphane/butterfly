import {
    Entity,
    Game,
    State,
    TextComponent,
} from "../../lib/juicy";

export default class GameScreen extends State {
    text: TextComponent;

    constructor() {
        super();

        const text = new Entity(this);
        this.text = text.add(TextComponent);
        this.text.set({
            text: 'Loaded!',
            fillStyle: 'black',
            size: 72,
            font: 'Poiret One'
        }).then(() => {
            text.position.x = (Game.width - text.width) / 2;
            text.position.y = 20;
        });
    }

    update(dt: number) {
    }
};
