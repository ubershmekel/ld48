import './style.css'
import 'phaser';
import { MenuScene } from './menu-scene';
import { DigScene }  from './dig-scene';

const GameConfig: Phaser.Types.Core.GameConfig = {
  title: 'Tank',
  url: 'https://github.com/digitsensitive/phaser3-typescript',
  version: '2.0',
  width: 800,
  height: 600,
  type: Phaser.AUTO,
  parent: 'app',
  scene: [MenuScene, DigScene],
  input: {
    keyboard: true
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
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
