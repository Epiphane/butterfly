import { Game, Sound } from '../lib/juicy';
import Keys from './helpers/keys';
import LoadingScreen from './states/loading';

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;

Game.init('game-canvas', GAME_WIDTH, GAME_HEIGHT, Keys);

// Document events
document.addEventListener('mousewheel', Game.trigger.bind(Game, 'mousewheel'));

window.onresize = () => Game.resize();

// Music
Sound.Load('FubSong', {
    src: './audio/FubSong.mp3',
    loop: true,
    volume: 0.01
});

// Sound.Play('FubSong');

Game.setState(new LoadingScreen()).run();

// Game.setDebug(document.getElementById("fps")!);
