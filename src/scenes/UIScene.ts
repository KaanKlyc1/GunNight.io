import GameScene from "./GameScene";

export default class UIScene extends Phaser.Scene {
  gameScene: Phaser.Scene;
  scoreText: Phaser.GameObjects.Text;
  coinIcon: Phaser.GameObjects.Image;

  constructor() {
    super("UI"); // Name of the scene
  }

  init(): void {
    this.gameScene = this.scene.get("Game");
  }

  create(): void {
    this.setupUIElements();
    this.setupEvents();
  }

  setupUIElements(): void {
    this.scoreText = this.add.text(35, 492, "Bullets: 24", {
      fontSize: "16px",
      color: "white",
    });

    this.coinIcon = this.add.image(15, 500, "items", 3);
  }

  setupEvents(): void {
    this.gameScene.events.on("updateScore", (score: number) => {
      this.scoreText.setText(`Coins: ${score}`);
    });
  }
}
