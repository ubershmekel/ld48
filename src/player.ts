/**
 * A class that wraps up our 2D platforming player logic. It creates, animates and moves a sprite in
 * response to WASD/arrow keys. Call its update method from the scene's update and call its destroy
 * method when you're done with the player.
 */

export default class Player extends Phaser.Physics.Arcade.Sprite {
  keys: any;
  isAlive = false;
  target = new Phaser.Math.Vector2();
  speed = 100;
  lastX = 0;
  lastY = 0;
  distanceMoved = 0;
  // scene: Phaser.Scene;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    // scene.physics.add.sprite
    // super(scene, x, y, 'assets', 'player');
    // super(scene, x, y, 'ant-top');
    // this.setScale(0.2);
    super(scene, x, y, 'player', 0);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    this.lastX = x;
    this.lastY = y;

  }

  start() {
    this.isAlive = true;
  }

  preUpdate(time: any, delta: any) {
    // https://phaser.discourse.group/t/solved-animation-on-extends-sprites-class/3035
    super.preUpdate(time, delta);

    this.distanceMoved += Phaser.Math.Distance.BetweenPoints(this, {x: this.lastX, y: this.lastY});
    this.lastX = this.x;
    this.lastY = this.y;
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

