import 'phaser';
import { MenuScene } from './menu-scene';
import { DigScene } from './dig-scene';
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
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};


export class Game extends Phaser.Game {
  constructor(config: Phaser.Types.Core.GameConfig) {
    super(config);
  }
}

declare global {
  // Avoid this error:
  //   Property '_game' does not exist on type 'Window & typeof globalThis'.
  // https://stackoverflow.com/questions/12709074/how-do-you-explicitly-set-a-new-property-on-window-in-typescript
  interface Window {
    _game: Phaser.Game;
  }
}

window.addEventListener('load', () => {
  window._game = new Game(GameConfig);
});
