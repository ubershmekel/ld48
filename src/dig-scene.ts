import 'phaser';
import particleUrl from '../assets/images/particle-poop-gas.png';
import soundUrl from '../assets/audio/test.mp3';
import tileMapUrl from '../assets/images/tilemap.png';
import groundUrl from '../assets/images/ground.png';
import elephantUrl from '../assets/images/elephant.png';
import digTrailUrl from '../assets/images/digTrail.png';
import flyUrl from '../assets/images/fly.png';
import poopFalafelUrl from '../assets/images/poopFalafel.png';
import antTopUrl from '../assets/images/ant-top.png';
import foundBobUrl from '../assets/images/foundBob.png';
import tileMapDataUrl from '../assets/images/bob-map.json';
import Player from './player';
import { getRandomArbitrary, getRandomInt, globalDebug, sleep, tweenPromise } from './utils';
import { playDistance, playWinSound } from './sounds';
import { DialogBox } from './dialog-box';
import { storyLines } from './text';

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
  private lastDistanceUpdateTime = 0;
  private instructions!: Phaser.GameObjects.Text;
  private bobTarget!: Phaser.GameObjects.Image;
  private startDistance = 1e9;
  private dialog!: DialogBox;
  private helpTipSeen = false;
  private distanceUpdatesCount = 0;
  private trail!: Phaser.GameObjects.Image[];
  private poopRegion!: Rect;

  constructor() {
    super({
      key: 'DigScene'
    });
  }

  init(props: any) {
    this.level = props.level || 1;
    this.distanceUpdatesCount = 0;
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
    this.load.image("digTrail", digTrailUrl);
    this.load.image("foundBob", foundBobUrl);
    this.load.image("poopFalafel", poopFalafelUrl);
    this.load.image("ant-top", antTopUrl);
    this.load.tilemapTiledJSON('map', tileMapDataUrl);
    this.load.image("ground", groundUrl);
    this.load.image("elephant", elephantUrl);

    this.load.spritesheet(
      "sprite-sheet",
      tileMapUrl,
      {
        frameWidth: 64,
        frameHeight: 64,
        margin: 0,
        spacing: 0,
      }
    );

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

  createAnims() {
    // Create the animations we need from the player spritesheet
    const anims = this.anims;
    anims.create({
      key: "player-idle",
      frames: anims.generateFrameNumbers("sprite-sheet", { start: 4, end: 7 }),
      frameRate: 3,
      repeat: -1
    });
    anims.create({
      key: "player-run",
      frames: anims.generateFrameNumbers("sprite-sheet", { start: 8, end: 9 }),
      frameRate: 8,
      repeat: -1
    });
    anims.create({
      key: "bob-celebrate",
      frames: anims.generateFrameNumbers("sprite-sheet", { start: 10, end: 13 }),
      frameRate: 4,
      repeat: -1
    });
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
    this.physics.add.overlap(this.player, this.bobTarget, this.levelEnd, undefined, this);
    this.poopRegion = this.getBoundingRect(poopImages);
    console.log("poop region", this.poopRegion);
  }

  getBoundingRect(items: any[]): Rect {
    let minX = items[0].x;
    let minY = items[0].y;
    let maxX = minX;
    let maxY = minY;
    for (const im of items) {
      minX = Math.min(im.x, minX);
      minY = Math.min(im.y, minY);
      maxX = Math.max(im.x, maxX);
      maxY = Math.max(im.y, maxY);
    }
    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
    }
  }

  // foundBob(player: Player, poopImage: Phaser.GameObjects.Image) {
  async levelEnd(playerTypeLess: any, poopImageTypeLess: any) {
    const player = playerTypeLess as Player;
    const poopImage = poopImageTypeLess as Phaser.GameObjects.Image;
    if (!player.isAlive) {
      return;
    }

    // Now celebrate and go to the next level
    const storyLineIndex = this.level - 1;
    let textPromise = null;
    if (storyLineIndex < storyLines.length) {
      textPromise = this.dialog.setText(storyLines[this.level - 1][0])
      this.dialog.show();
    }

    player.isAlive = false;
    console.log("Found bob!", player, poopImage);
    playWinSound();

    // poopImage.scale = 1.2;
    tweenPromise(this, {
      targets: poopImage,
      scale: 1.3,
      // ease: 'Linear',
      duration: 300,
    });

    await sleep(100);
    // bring the poop to the front
    poopImage.depth = 1;

    const bob = this.add.sprite(poopImage.x, poopImage.y, 'bob', 0);
    bob.anims.play("bob-celebrate", true);
    bob.alpha = 0;
    // `bob.depth` so Bob shows up above the poop and the player
    bob.depth = 3;
    tweenPromise(this, {
      targets: bob,
      duration: 300,
      alpha: 1,
    });
    await tweenPromise(this, {
      targets: bob,
      duration: 600,
      y: '+=40',
      ease: 'Bounce.easeOut',
    });

    if (textPromise) {
      await textPromise;
      await sleep(1000);
      this.dialog.moveToTop();
      await this.dialog.setText(storyLines[this.level - 1][1]);
    }
    await sleep(1500);

    this.scene.restart({ level: this.level + 1 });
  }

  createBackground() {
    // this.createMap();
    
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
    this.createAnims();

    this.dialog = new DialogBox(this);
    if (this.level === 1) {
      this.dialog.setText("I can't believe Bob got lost in the poop. Conveniently, the piano 🎹 plays a higher note ♯🎵 when I get closer to Bob 🐜.");
      this.dialog.moveToBottom();
    } else {
      this.dialog.hide();
    }

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
    this.player.depth = 2;
    this.cameras.main.startFollow(this.player);

    this.createTrailFollowPlayer();
  }

  start() {
    this.player.start();
    this.instructions.setVisible(false);
    this.giveDistanceUpdate();
    this.dialog.hide();
  }

  giveDistanceUpdate() {
    this.distanceUpdatesCount += 1;
    this.lastDistanceUpdateTime = new Date().getTime();
    const dist = Phaser.Math.Distance.BetweenPoints(this.player, this.bobTarget);
    const relativeToStart = dist / this.startDistance;
    playDistance(relativeToStart);
  }

  maybeShowHelpDialog() {
    const dist = Phaser.Math.Distance.BetweenPoints(this.player, this.bobTarget);
    const notWinning = this.distanceUpdatesCount > 8 || dist > 1000;
    if (notWinning && this.level < 8 && !this.helpTipSeen) {
      console.log("You need some help");
      this.dialog.setText("You're pretty far off... Go find Bob 🐜 in the poop 💩!");
      this.dialog.show();
      this.helpTipSeen = true;
    }
  }

  createTrailFollowPlayer() {
    const trailSplotchCount = 20;
    this.trail = [];
    this.lastDistance = 0;
    for (let i = 0; i < trailSplotchCount; i++) {
      // -2000, -2000 to hide these trails initially
      const image = this.add.image(-2000, -2000, 'digTrail');
      image.scale = 0.5;
      image.setBlendMode(Phaser.BlendModes.MULTIPLY);
      this.trail.push(image);
    }
  }

  lastDistance = 0;
  updateTrail() {
    if (this.player.distanceMoved - this.lastDistance > 10) {
      this.lastDistance = this.player.distanceMoved;
      const lastTrail = this.trail.shift()!;
      lastTrail.x = this.player.x;
      lastTrail.y = this.player.y;
      this.trail.push(lastTrail);
    }
  }

  update(): void {
    this.maybeShowHelpDialog();

    this.updateTrail();

    const msBetweenChords = 3000;
    if (this.player.isAlive) {
      const msSinceLastDistanceUpdate = new Date().getTime() - this.lastDistanceUpdateTime;
      if (msSinceLastDistanceUpdate > msBetweenChords) {
        this.lastDistanceUpdateTime = 0;
        this.giveDistanceUpdate();
      }
    }

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

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}