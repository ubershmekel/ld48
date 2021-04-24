/**
 * A class that wraps up our 2D platforming player logic. It creates, animates and moves a sprite in
 * response to WASD/arrow keys. Call its update method from the scene's update and call its destroy
 * method when you're done with the player.
 */

 export default class Player extends Phaser.Physics.Arcade.Image {
  keys: any;
  isAlive = false;
  target = new Phaser.Math.Vector2();
  speed = 300;
  // scene: Phaser.Scene;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    // super(scene, x, y, 'assets', 'player');
    super(scene, x, y, 'ant-top');
    this.setScale(0.2);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    
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

  start () {
      this.isAlive = true;

      this.scene.input.on('pointermove', (pointer: Phaser.Input.Pointer) =>
      {
          if (this.isAlive)
          {
              this.target.x = pointer.x;
              this.target.y = pointer.y;
              
              //  Add 90 degrees because the sprite is drawn facing up
              this.rotation = this.scene.physics.moveToObject(this, this.target, this.speed) + Math.PI / 2;
          }
      });
  }

  // update(time: sec, deltaMs) {
  //   const { keys, sprite } = this;
  //   const onGround = sprite.body.blocked.down;


  //   // const acceleration = onGround ? 600 : 200;
  //   const acceleration = 400;
  //   // console.log("sprite xy", this.sprite.x, this.sprite.y);
  //   //Howler.pos(this.sprite.x, this.sprite.y, 0);

  //   if (!onGround && !this.wasInAir && !this.justJumped && this.sprite.body.moves) {
  //     // You were on the ground, now you're not,
  //     // and you didn't jump. You slipped.
  //     // Also without `this.sprite.body.moves` the freezes cause a slip.
  //     this.scene.sounds.playSlipped();
  //     counter.slips += 1;
  //   }

  //   // Only allow the player to jump if they are on the ground
  //   if (onGround && (keys.up.isDown || keys.w.isDown)) {
  //     // 🦘☝
  //     console.log("jump");
  //     sprite.setVelocityY(-480);
  //     this.scene.sounds.playJump();
  //     counter.jumps += 1;
  //     this.justJumped = true;
  //   } else {
  //     this.justJumped = false;
  //   }

  //   // Update the animation/texture based on the state of the player
  //   if (onGround) {
  //     if (sprite.body.velocity.x !== 0) {
  //       sprite.anims.play("player-run", true);
  //       this.scene.sounds.walkingOn(Math.abs(sprite.body.velocity.x / maxVelocityX));
  //     } else {
  //       sprite.anims.play("player-idle", true);
  //       this.scene.sounds.walkingOff();
  //     }
  //     if (this.wasInAir) {
  //       const tileY = this.scene.groundLayer.getTileAtWorldXY(sprite.x, sprite.y, true).y;
  //       this.scene.sounds.playLanded(tileY);
  //     }

  //     const fallDelta = this.maxYSinceGround - this.minYUntilGround;
  //     if (fallDelta > 300) {
  //       console.log("fallDelta", fallDelta, this.minYUntilGround, this.maxYSinceGround);
  //       this.scene.sounds.sayAnyway("huge_fall");
  //       counter.fallHeight += fallDelta;
  //     }
  //     this.maxYSinceGround = sprite.y;
  //     this.minYUntilGround = sprite.y;
  //   } else {
  //     sprite.anims.stop();
  //     sprite.setTexture("player", 10);
  //     this.scene.sounds.walkingOff();
  //     if (sprite.y > this.maxYSinceGround) {
  //       this.maxYSinceGround = sprite.y;
  //     }
  //     if (sprite.y < this.minYUntilGround) {
  //       this.minYUntilGround = sprite.y;
  //     }
  //   }

  //   // Flying sound based on y velocity
  //   this.scene.sounds.playFlying(0.08 * Math.abs(sprite.body.velocity.y / maxVelocityY));

  //   // is on ledge?
  //   const tile = this.scene.groundLayer.getTileAtWorldXY(sprite.x, sprite.y, true);
  //   if (tile) {
  //     const underRight = this.scene.groundLayer.getTileAt(tile.x + 1, tile.y + 1, true);
  //     const underJust = this.scene.groundLayer.getTileAt(tile.x, tile.y + 1, true);
  //     const underLeft = this.scene.groundLayer.getTileAt(tile.x - 1, tile.y + 1, true);
  //     // console.log('tilexy', tile.x, tile.y, underLeft.index, underJust.index, underRight.index);
  //     if (onGround && underJust.index === -1) {
  //       // a few pixels from falling
  //       if (underRight.index !== -1) {
  //         this.scene.sounds.playCliffOnLeft();
  //       } else if (underLeft.index !== -1) {
  //         this.scene.sounds.playCliffOnRight();
  //       }
  //     } else {
  //       this.scene.sounds.playNoCliff();
  //     }
  //   }

  //   // Apply horizontal acceleration when left/a or right/d are applied
  //   if (keys.left.isDown || keys.a.isDown) {
  //     // 👈
  //     sprite.setAccelerationX(-acceleration);
  //     // sprite.setVelocityX(-130);
  //     // No need to have a separate set of graphics for running to the left & to the right. Instead
  //     // we can just mirror the sprite.
  //     sprite.setFlipX(true);
  //   } else if (keys.right.isDown || keys.d.isDown) {
  //     // 👉
  //     // sprite.setVelocityX(130);
  //     sprite.setAccelerationX(acceleration);
  //     sprite.setFlipX(false);
  //   } else {
  //     sprite.setAccelerationX(0);
  //   }

  //   // BUMP SOUNDS
  //   if (sprite.body.blocked.up) {
  //     this.scene.sounds.playBumpTop();
  //     counter.headBump += 1;
  //     if (counter.headBump % 120 === 3) {
  //       this.scene.sounds.say('bump_head_hurts');
  //     }
  //   }
  //   if (sprite.body.blocked.right) {
  //     this.scene.sounds.touchRightOn();
  //     counter.wallHugRightMs += deltaMs;
  //   } else {
  //     this.scene.sounds.touchRightOff();
  //   }
  //   if (sprite.body.blocked.left) {
  //     this.scene.sounds.touchLeftOn();
  //     counter.wallHugLeftMs += deltaMs;
  //   } else {
  //     this.scene.sounds.touchLeftOff();
  //   }

  //   if (counter.wallHugRightMs > 7000) {
  //     this.scene.sounds.say('love_wall_right');
  //   }
  //   if (counter.wallHugLeftMs > 7000) {
  //     this.scene.sounds.say('love_wall_left');
  //   }

  //   this.wasInAir = !onGround;
  // }
}
