import './style.css'
import 'phaser';
import { MenuScene } from './menu-scene';
import { DigScene }  from './dig-scene';
import { globalDebug } from './utils';

const GameConfig: Phaser.Types.Core.GameConfig = {
  title: 'Where is Bob',
  url: 'https://yuvalg.com',
  version: '2.0',
  width: 800,
  height: 600,
  type: Phaser.AUTO,
  parent: 'app',
  scene: [
    DigScene,
    MenuScene,
  ],
  input: {
    keyboard: true
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: globalDebug,
    }
  },
  backgroundColor: '#000000',
  render: { pixelArt: false, antialias: true },
  audio: {
    // `disableWebAudio: false` is for ios audio
    disableWebAudio: false,
  },
};


export class Game extends Phaser.Game {
  constructor(config: Phaser.Types.Core.GameConfig) {
    super(config);
  }
}

window.addEventListener('load', () => {
  const game = new Game(GameConfig);
  console.log(game);
});
