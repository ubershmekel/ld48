export class DialogBox {
  scene: Phaser.Scene;
  sceneText: Phaser.GameObjects.Text;
  graphics: Phaser.GameObjects.Graphics;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    // Based off of https://gamedevacademy.org/create-a-dialog-modal-plugin-in-phaser-3-part-1/
    // but much simpler
    const borderThickness = 3;
    const borderColor = 0x404798;
    const borderAlpha = 1;
    const windowAlpha = 0.8;
    const windowColor = 0x373737;
    const windowHeight = 150;
    const margin = 20;
    const gameWidth = +scene.sys.game.config.width;
    const gameHeight = +scene.sys.game.config.height;
    const rectWidth = gameWidth - (margin * 2);
    const rectHeight = windowHeight;
    const x = margin;
    const y = gameHeight - windowHeight - margin;

    const graphics = scene.add.graphics();
    this.graphics = graphics;
    // Creates the inner dialog window (where the text is displayed)
    graphics.fillStyle(windowColor, windowAlpha);
    graphics.fillRect(x + 1, y + 1, rectWidth - 1, rectHeight - 1);

    // Creates the border rectangle of the dialog window
    graphics.lineStyle(borderThickness, borderColor, borderAlpha);
    graphics.strokeRect(x, y, rectWidth, rectHeight);
    graphics.setScrollFactor(0);

    // Make text
    const padding = 10;
    const sceneText = scene.make.text({
      x: margin + padding,
      y: y + padding,
      text: "",
      style: {
        wordWrap: { width: gameWidth - (margin * 2) - 25 },
        fontSize: '26px',
      },
    });
    sceneText.setScrollFactor(0);
    this.sceneText = sceneText;
  }

  setText(text: string) {
    // Slowly display the text in the window
    const animateText = () => {
      const sceneText = this.sceneText;
      const nextIndex = sceneText.text.length;
      if (sceneText.text.length === text.length) {
        timedEvent.remove();
      } else {
        sceneText.setText(sceneText.text + text[nextIndex]);
      }
    }
    const timedEvent = this.scene.time.addEvent({
      delay: 10,
      callback: animateText,
      // callbackScope: this,
      loop: true
    });
  }

  hide() {
    this.sceneText.visible = false;
    this.graphics.visible = false;
  }
}