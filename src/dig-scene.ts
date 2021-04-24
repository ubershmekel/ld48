import 'phaser';
import particleUrl from '../assets/images/particle-poop-gas.png';
import soundUrl from '../assets/audio/test.mp3';
import tileMapUrl from '../assets/images/tilemap.png';
import flyUrl from '../assets/images/fly.png';
import antTopUrl from '../assets/images/ant-top.png';
import tileMapDataUrl from '../assets/images/bob-map.json';
import Player from './player';

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
  
    this.add.graphics()
      .lineStyle(3, 0xdddd78, 1)
      .strokeRect(0, 0, this.physics.world.bounds.width, this.physics.world.bounds.height);

    this.player = new Player(this, 400, 400);
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