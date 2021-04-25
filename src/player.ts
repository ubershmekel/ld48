/**
 * A class that wraps up our 2D platforming player logic. It creates, animates and moves a sprite in
 * response to WASD/arrow keys. Call its update method from the scene's update and call its destroy
 * method when you're done with the player.
 */

export default class Player extends Phaser.Physics.Arcade.Image {
  keys: any;
  isAlive = false;
  target = new Phaser.Math.Vector2();
  speed = 100;
  // scene: Phaser.Scene;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    // super(scene, x, y, 'assets', 'player');
    super(scene, x, y, 'ant-top');
    this.setScale(0.2);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    // this.scene.physics.world.on('worldbounds', function (body: any) {
    //   console.log('hello from the edge of the world', body);
    // }, this);



    // this.scene = scene;

    // Create the animations we need from the player spritesheet
    // const anims = scene.anims;
    // anims.create({
    //   key: "player-idle",
    //   frames: anims.generateFrameNumbers("player", { start: 0, end: 3 }),
    //   frameRate: 3,
    //   repeat: -1
    // });
    // anims.create({
    //   key: "player-run",
    //   frames: anims.generateFrameNumbers("player", { start: 8, end: 15 }),
    //   frameRate: 12,
    //   repeat: -1
    // });

    // // Create the physics-based sprite that we will move around and animate
    // this.sprite = scene.physics.add
    //   .sprite(x, y, "player", 0)
    //   .setDrag(1000, 0)
    //   .setMaxVelocity(maxVelocityX, maxVelocityY)
    //   .setSize(18, 24)
    //   .setOffset(7, 9);

    // // for debugging
    // window.sprite = this.sprite;

    // this.sprite = scene.physics.add
    //   .sprite(x, y, "player", 0);

    // Track the arrow keys & WASD
    const { LEFT, RIGHT, UP, W, A, D } = Phaser.Input.Keyboard.KeyCodes;
    this.keys = scene.input.keyboard.addKeys({
      left: LEFT,
      right: RIGHT,
      up: UP,
      w: W,
      a: A,
      d: D
    });
  }

  start() {
    this.isAlive = true;
    // this.scene.input.on('pointermove', (_pointer: Phaser.Input.Pointer) => {
      // const preRotation = this.rotation;
      // if (this.isAlive) {
      //   this.target.x = pointer.x;
      //   this.target.y = pointer.y;

      //   //  Add 90 degrees because the sprite is drawn facing up
      //   this.rotation = this.scene.physics.moveToObject(this, this.target, this.speed) + Math.PI / 2;
      //   // console.log('target', this.target, preRotation, this.rotation, this.scene.physics.world.bounds);
      //   console.log(this.body.x, this.body.y)

      // }
    // });
  }

  preUpdate() {
    if (this.isAlive) {
      const pointer = this.scene.input.activePointer;
      const worldPoint = pointer.positionToCamera(this.scene.cameras.main) as Phaser.Math.Vector2;
      this.target.x = worldPoint.x;
      this.target.y = worldPoint.y;
      // console.log(this.x, this.y, this.target.x, this.target.y);

      //  Add 90 degrees because the sprite is drawn facing up
      this.rotation = this.scene.physics.moveToObject(this, this.target, this.speed) + Math.PI / 2;
      // console.log('target', this.target, preRotation, this.rotation, this.scene.physics.world.bounds);
      // console.log(this.body.x, this.body.y)

    }

    if (!this.isAlive || Phaser.Math.Distance.Between(this.x, this.y, this.target.x, this.target.y) < 20) {
      // this.body.reset(this.target.x, this.target.y);
      this.body.reset(this.x, this.y);
    }
  }
}

