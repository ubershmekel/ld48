const borderThickness = 3;
const borderColor = 0x404798;
const borderAlpha = 1;
const boxAlpha = 0.8;
const boxColor = 0x373737;
const boxHeight = 150;
const margin = 20;
const padding = 10;

export class DialogBox {
  scene: Phaser.Scene;
  sceneText: Phaser.GameObjects.Text;
  graphics: Phaser.GameObjects.Graphics;
  targetText = '';
  resolver: VoidFunction | null = null;
  promise: Promise<void> | null = null;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    // Based off of https://gamedevacademy.org/create-a-dialog-modal-plugin-in-phaser-3-part-1/
    // but much simpler
    const gameWidth = +scene.sys.game.config.width;
    const gameHeight = +scene.sys.game.config.height;
    const boxWidth = gameWidth - (margin * 2);
    const boxX = margin;
    const boxY = gameHeight - boxHeight - margin;

    const graphics = scene.add.graphics();
    this.graphics = graphics;
    // Creates the inner dialog window (where the text is displayed)
    graphics.fillStyle(boxColor, boxAlpha);
    graphics.fillRect(boxX + 1, boxY + 1, boxWidth - 1, boxHeight - 1);

    // Creates the border rectangle of the dialog window
    graphics.lineStyle(borderThickness, borderColor, borderAlpha);
    graphics.strokeRect(boxX, boxY, boxWidth, boxHeight);
    graphics.setScrollFactor(0);

    // Make text
    this.targetText = '';
    const sceneText = scene.make.text({
      x: margin + padding,
      y: boxY + padding,
      text: "",
      style: {
        wordWrap: { width: gameWidth - (margin * 2) - 25 },
        fontSize: '26px',
      },
    });
    sceneText.setScrollFactor(0);
    this.sceneText = sceneText;

    // Dialog should be in front of most things
    sceneText.depth = 9;
    graphics.depth = 9;
  }

  moveToTop() {
    const gameHeight = +this.scene.sys.game.config.height;
    const boxY = margin;
    const textY = boxY + padding
    // Note that `graphics.y` is an offset, while `sceneText.y` is in screen-space
    this.sceneText.y = textY;
    this.graphics.y = - gameHeight + boxHeight + margin + margin;
  }

  moveToBottom() {
    const gameHeight = +this.scene.sys.game.config.height;
    const boxY = gameHeight - boxHeight - margin;
    // Note that `graphics.y` is an offset, while `sceneText.y` is in screen-space
    this.sceneText.y = boxY + padding;
    this.graphics.y = 0;
  }

  setText(text: string): Promise<void> {
    // Slowly display the text in the dialog box
    const sceneText = this.sceneText;
    this.targetText = text;
    sceneText.setText('');
    this.promise = new Promise<void>((resolve) => {
      this.resolver = resolve;
      const doneAnimating = () => {
        timedEvent.remove();
      }

      const animateText = () => {
        const nextIndex = sceneText.text.length;
        if (this.targetText !== text) {
          // In an async situation where someone called setText
          // and then setText again while this `animateText` is still happening
          // then this.targetText and `text` will be out of sync and corrupt the dialog.
          // I might fix this bug later.
          console.log("DUPLICATE DIALOG SET TEXT NO BUENO", text, this.targetText);
          doneAnimating();
          return;
        }
        if (nextIndex >= text.length) {
          doneAnimating();
          return;
        }

        sceneText.setText(sceneText.text + text[nextIndex]);

      }
      const timedEvent = this.scene.time.addEvent({
        delay: 10,
        callback: animateText,
        loop: true
      });
    });

    return this.promise;
  }

  skipClick(): Promise<void> {
    if (this.targetText === this.sceneText.text) {
      // dismiss
      if (this.resolver) {
        this.resolver();
      }
      this.resolver = null;
    } else {
      // finish typing it out
      this.sceneText.setText(this.targetText);
    }

    if (this.promise) {
      return this.promise;
    } else {
      // No dialog presented yet. Pretend we dismissed it already.
      return Promise.resolve();
    }
  }

  isVisible() {
    return this.graphics.visible;
  }

  hide() {
    this.sceneText.visible = false;
    this.graphics.visible = false;
  }

  show() {
    this.sceneText.visible = true;
    this.graphics.visible = true;
  }
}