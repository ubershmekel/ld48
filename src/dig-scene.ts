import 'phaser';
import particleUrl from '../assets/images/particle-poop-gas.png';
import soundUrl from '../assets/audio/test.mp3';
import tileMapUrl from '../assets/images/tilemap.png';
import flyUrl from '../assets/images/fly.png';
import poopFalafelUrl from '../assets/images/poopFalafel.png';
import antTopUrl from '../assets/images/ant-top.png';
import tileMapDataUrl from '../assets/images/bob-map.json';
import Player from './player';
import { getRandomArbitrary, getRandomInt, globalDebug } from './utils';

const brownColors = [
  0x513015,
  0x553120, // brownest?
  0x583325,
  0x6c4316,
  // 0x783524,
  // 0x81581a,
  // 0x93613a,
];

function randomBrown() {
  return brownColors[Math.floor(Math.random() * brownColors.length)]
}

export class DigScene extends Phaser.Scene {
  private startKey!: Phaser.Input.Keyboard.Key;
  private sprites: { s: Phaser.GameObjects.Image, r: number }[] = [];
  private marker!: Phaser.GameObjects.Graphics;
  private groundLayer!: Phaser.Tilemaps.TilemapLayer;
  private player!: Player;

  constructor() {
    super({
      key: 'DigScene'
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
    this.load.image("poopFalafel", poopFalafelUrl);
    this.load.image("ant-top", antTopUrl);
    this.load.tilemapTiledJSON('map', tileMapDataUrl);

  }

  createMap() {
    const map = this.make.tilemap({ key: "map" });
    // `addTilesetImage` tells phaser where the image is for this tile map
    const tiles = map.addTilesetImage("bob-the-ant", "tiles");
    this.groundLayer = map.createLayer("Tile Layer 1", tiles);
    this.marker = this.add.graphics();
    this.marker.lineStyle(5, 0xffffff, 1);
    this.marker.strokeRect(0, 0, map.tileWidth, map.tileHeight);
    this.marker.lineStyle(3, 0xff4f78, 1);
    this.marker.strokeRect(0, 0, map.tileWidth, map.tileHeight);
  }

  generatePoopMap() {
    // Example poop piles
    //   *
    //  ***
    // *****

    //     *
    //    **
    //   ***
    // *****

    // *
    // ***
    //  ***
    //*****
    //
    const baseWidth = 10;
    const startX = 0;
    const startY = 0;
    const stepX = 100;
    const stepY = 100;
    const fuzzX = stepX / 8;
    const fuzzY = stepY / 8;
    let width = baseWidth;
    let height = 0;
    let offset = 0;
    while (width > 0) {
      for (let i = 0; i < width; i++) {
        const imageX = startX + i * stepX + Math.random() * fuzzX + offset * stepX;
        const imageY = startY - height * stepY + Math.random() * fuzzY;
        const image = this.add.image(imageX, imageY, 'poopFalafel');
        image.tint = randomBrown();
        image.scale = getRandomArbitrary(0.9, 1.1);
      }

      width -= 1;
      if (Math.random() > 0.5) {
        width -= 1;
      }
      height += 1;
      if (width > 1) {
        offset = offset + getRandomInt(-1, 1);
      }
    }
  }

  create(): void {
    // createMap();

    // this.physics.world.setBounds(0, 0, 1e4, 1e4);
    console.log("world", this.physics.world.bounds);
    // Limit the camera to the map size
    // this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    this.add.text(0, 0, 'Press S to restart', {
      fontSize: '60px',
      fontFamily: "Helvetica",
    });

    this.add.image(100, 100, 'particle');
    this.generatePoopMap();

    // for (let i = 0; i < 300; i++) {
    //   const x = Phaser.Math.Between(-64, 800);
    //   const y = Phaser.Math.Between(-64, 600);

    //   const image = this.add.image(x, y, 'particle');
    //   image.setBlendMode(Phaser.BlendModes.NORMAL);
    //   this.sprites.push({ s: image, r: 2 + Math.random() * 6 });
    // }

    this.input.once('pointerup', (_pointer: Phaser.Input.Pointer) => {
      // var touchX = pointer.x;
      // var touchY = pointer.y;
      // ...
      // this.sound.add('overture', { loop: false }).play();
      // this.scene.start(this);
      
      this.player.start();
    });
  
    if (globalDebug) {
      // World bounds rectangle for debug
      this.add.graphics()
        .lineStyle(3, 0xdddd78, 1)
        .strokeRect(0, 0, this.physics.world.bounds.width, this.physics.world.bounds.height);
    }
    this.player = new Player(this, 0, 0);
  }

  update(): void {
    this.cameras.main.startFollow(this.player);

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

    // Show debug pointer
    if (this.marker) {
      const pointer = this.input.activePointer;
      const worldPoint = pointer.positionToCamera(this.cameras.main) as Phaser.Math.Vector2;
      const pointerTileXY = this.groundLayer.worldToTileXY(worldPoint.x, worldPoint.y);
      const snappedWorldPoint = this.groundLayer.tileToWorldXY(pointerTileXY.x, pointerTileXY.y);
      this.marker.setPosition(snappedWorldPoint.x, snappedWorldPoint.y);  
    }
  }
}