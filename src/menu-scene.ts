import 'phaser';
import particleUrl from '../assets/images/particle-poop-gas.png';
import soundUrl from '../assets/audio/test.mp3';
import tileMapUrl from '../assets/images/tilemap.png';
import tileMapDataUrl from '../assets/images/bob-map.json';

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
    this.load.tilemapTiledJSON('map', tileMapDataUrl);

  }

  create(): void {
    const map = this.make.tilemap({ key: "map" });
    // `addTilesetImage` tells phaser where the image is for this tile map
    const tiles = map.addTilesetImage("bob-the-ant", "tiles");
    map.createLayer("Tile Layer 1", tiles);
    // Limit the camera to the map size
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    this.add.text(0, 0, 'Press S to restart scene', {
      fontSize: '60px',
      fontFamily: "Helvetica",
    });

    this.add.image(100, 100, 'particle');

    for (let i = 0; i < 300; i++) {
      const x = Phaser.Math.Between(-64, 800);
      const y = Phaser.Math.Between(-64, 600);

      const image = this.add.image(x, y, 'particle');
      image.setBlendMode(Phaser.BlendModes.MULTIPLY);
      this.sprites.push({ s: image, r: 2 + Math.random() * 6 });
    }

    this.input.on('pointerup', (pointer: Phaser.Input.Pointer) => {
      var touchX = pointer.x;
      var touchY = pointer.y;
      // ...
      this.sound.add('overture', { loop: false }).play();
      this.scene.start(this);

    });
  
  }

  update(): void {
    if (this.startKey.isDown) {
      this.scene.start(this);
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