import 'phaser';
import particleUrl from '../assets/images/particle-poop-gas.png';
import soundUrl from '../assets/audio/test.mp3';
import tileMapUrl from '../assets/images/tilemap.png';
import groundUrl from '../assets/images/ground.png';
import elephantUrl from '../assets/images/elephant.png';
import flyUrl from '../assets/images/fly.png';
import poopFalafelUrl from '../assets/images/poopFalafel.png';
import antTopUrl from '../assets/images/ant-top.png';
import tileMapDataUrl from '../assets/images/bob-map.json';
import Player from './player';
import { getRandomArbitrary, getRandomInt, globalDebug } from './utils';
import { playDistance } from './sounds';

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
  private level = 1;
  private timeElapsedMs = 0;
  private instructions!: Phaser.GameObjects.Text;
  private bobTarget!: Phaser.GameObjects.Image;
  private startDistance = 1e9;

  constructor() {
    super({
      key: 'DigScene'
    });
  }

  init(props: any) {
    this.level = props.level || 1;
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
    this.load.image("ground", groundUrl);
    this.load.image("elephant", elephantUrl);

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

  generatePoopMap(baseWidth: number) {
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
    const stepX = 100;
    const stepY = 80;
    const startX = stepX + 20;
    const startY = -stepY;
    const fuzzX = stepX / 8;
    const fuzzY = stepY / 8;
    let width = baseWidth;
    let height = 0;
    let offset = 0;
    const poopImages = [];
    while (width > 0) {
      for (let i = 0; i < width; i++) {
        const imageX = startX + i * stepX + Math.random() * fuzzX + offset * stepX;
        const imageY = startY - height * stepY + Math.random() * fuzzY;
        const image = this.add.image(imageX, imageY, 'poopFalafel');
        image.tint = randomBrown();
        image.scale = getRandomArbitrary(0.9, 1.1);
        poopImages.push(image);
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

    // Hide Bob in a poop falafel
    let bobIndex = getRandomInt(0, poopImages.length - 1);
    if (poopImages.length > 1 && bobIndex == 0) {
      // Can't have Bob hide right at the start.
      bobIndex = 1;
    }
    this.bobTarget = poopImages[bobIndex];
    this.startDistance = Phaser.Math.Distance.BetweenPoints(this.player, this.bobTarget);
    this.physics.add.existing(this.bobTarget);
    this.physics.add.overlap(this.player, this.bobTarget, this.foundBob, undefined, this);
  }

  // foundBob(player: Player, poopImage: Phaser.GameObjects.Image) {
  foundBob(player: any, poopImage: any) {
    if (player.isAlive) {
      console.log("Found bob!", player, poopImage);
      poopImage.scale = 2;
      this.scene.restart({ level: this.level + 1 });
    }
    player.isAlive = false;
  }

  createBackground() {
    // createMap();
    this.cameras.main.backgroundColor = Phaser.Display.Color.HexStringToColor("#4499ee");

    const ground = this.add.image(0, -90, "ground");
    ground.setOrigin(0.5, 0);
    ground.displayWidth = 4000;
    ground.displayHeight = 600;

    const elephant = this.add.image(-100, 0, "elephant");
    elephant.setOrigin(1.0, 1.0);
    elephant.scale = 2;
  }

  create(): void {
    this.createBackground();

    // this.physics.world.setBounds(0, 0, 1e4, 1e4);
    // console.log("world", this.physics.world.bounds);
    // Limit the camera to the map size
    // this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    this.player = new Player(this, 0, 0);

    this.add.image(100, 100, 'particle');
    this.generatePoopMap(this.level + 5);

    this.instructions = this.add.text(-100, 0, 'Tap/click to start', {
      fontSize: '60px',
      fontFamily: "Helvetica",
    });

    const status = this.add.text(10, 10, 'Level ' + this.level, {
      fontSize: '30px',
      fontFamily: "Helvetica",
    });
    // The status should not scroll when the camera moves
    status.setScrollFactor(0);

    this.input.once('pointerup', (_pointer: Phaser.Input.Pointer) => {
      this.start();
    });
  
    if (globalDebug) {
      // World bounds rectangle for debug
      this.add.graphics()
        .lineStyle(3, 0xdddd78, 1)
        .strokeRect(0, 0, this.physics.world.bounds.width, this.physics.world.bounds.height);
    }

    // Make sure the player is rendered above the poop.
    // Note we must initialize the player before the poop because
    // we need the player during poop calculations.
    this.player.depth = 1;
  }

  start() {
    this.player.start();
    this.instructions.setVisible(false);
    this.giveDistanceUpdate();
  }

  giveDistanceUpdate() {
    const dist = Phaser.Math.Distance.BetweenPoints(this.player, this.bobTarget);
    const relativeToStart = dist / this.startDistance;
    playDistance(relativeToStart);
  }

  update(_time: number, deltaMs: number): void {
    const msBetweenChords = 3000;
    if (this.player.isAlive) {
      this.timeElapsedMs += deltaMs;
      if (this.timeElapsedMs > msBetweenChords) {
        this.timeElapsedMs -= msBetweenChords;
        this.giveDistanceUpdate();
      }
    }
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