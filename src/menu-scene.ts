import 'phaser';
import particleUrl from '../assets/images/particle-poop-gas.png';
import soundUrl from '../assets/audio/test.mp3';
import tileMapUrl from '../assets/images/tilemap.png';
import flyUrl from '../assets/images/fly.png';
import antTopUrl from '../assets/images/ant-top.png';
import tileMapDataUrl from '../assets/images/bob-map.json';
import splashScreenUrl from '../assets/images/splashScreen.png';
import pianoLessUrl from '../assets/audio/piano-less.mp3';
import { soundMarkers } from './new-sounds';

export class MenuScene extends Phaser.Scene {
  private startKey!: Phaser.Input.Keyboard.Key;
  private sprites: { s: Phaser.GameObjects.Image, r: number }[] = [];

  constructor() {
    super({
      key: 'MenuScene'
    });
  }

  preload(): void {
    this.startKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.S,
    );
    this.startKey.isDown = false;
    this.load.image('particle', particleUrl);
    this.load.audio('overture', soundUrl);

    this.load.image("tiles", tileMapUrl);
    this.load.image("fly", flyUrl);
    this.load.image("ant-top", antTopUrl);
    this.load.image("splashScreen", splashScreenUrl);
    this.load.tilemapTiledJSON('map', tileMapDataUrl);

    this.load.audio('piano', pianoLessUrl);
  }

  create(): void {
    // const map = this.make.tilemap({ key: "map" });
    // `addTilesetImage` tells phaser where the image is for this tile map
    // const tiles = map.addTilesetImage("bob-the-ant", "tiles");
    // this.groundLayer = map.createLayer("Tile Layer 1", tiles);

    // Limit the camera to the map size
    // this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    // this.add.text(0, 0, 'Press S to restart scene', {
    //   fontSize: '60px',
    //   fontFamily: "Helvetica",
    // });

    this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'splashScreen');

    for (let i = 0; i < 30; i++) {
      const x = Phaser.Math.Between(200, 400);
      const y = Phaser.Math.Between(-64, 600);

      const image = this.add.image(x, y, 'particle');
      image.setBlendMode(Phaser.BlendModes.NORMAL);
      this.sprites.push({ s: image, r: 2 + Math.random() * 6 });
    }

    this.input.once('pointerup', (_pointer: Phaser.Input.Pointer) => {
      this.exitMenu();
    });
  }

  exitMenu() {
    // welcomeSound();
    this.sound.play('piano', soundMarkers[0]);
    this.scene.start('DigScene');
  }

  update(): void {
    if (this.startKey.isDown) {
      this.exitMenu();
    }

    for (let i = 0; i < this.sprites.length; i++) {
      const sprite = this.sprites[i].s;
      sprite.y -= this.sprites[i].r;
      if (sprite.y < -256) {
        sprite.y = 700;
      }
    }
  }
}