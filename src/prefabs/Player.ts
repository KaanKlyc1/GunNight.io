export default class Player extends Phaser.Physics.Arcade.Image {
  speed: number;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    key: string
    /* 		frame: number */
  ) {
    super(scene, x, y, key);
    this.scene = scene;

    this.speed = 160;

    // Physics
    this.scene.physics.world.enable(this);
    this.setImmovable(false);
    /*     this.setScale(1); */
    this.setCollideWorldBounds(true);
    this.scene.add.existing(this);
  }

  update(cursors) {
    if (cursors.left.isDown) {
      this.setVelocityX(-this.speed);
      /* this.angle = 180; */
    } else if (cursors.right.isDown) {
      this.setVelocityX(this.speed);
      /*  this.angle = 0; */
    } else {
      this.setVelocityX(0);
    }

    if (cursors.up.isDown) {
      this.setVelocityY(-this.speed);
      /* this.angle = 270; */
    } else if (cursors.down.isDown) {
      this.setVelocityY(this.speed);
      /*   this.angle = 90; */
    } else {
      this.setVelocityY(0);
    }

    if (cursors.up.isDown && cursors.right.isDown) {
      this.setVelocityY(-this.speed);
      /* this.angle = 315; */
    } else if (cursors.down.isDown && cursors.right.isDown) {
      this.setVelocityY(this.speed);
      /*  this.angle = 45; */
    } else if (cursors.up.isDown && cursors.left.isDown) {
      /*    this.angle = 225; */
    } else if (cursors.down.isDown && cursors.left.isDown) {
      /*   this.angle = 135; */
    }
  }
}
