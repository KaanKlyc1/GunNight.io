import Player from "../prefabs/Player";
import Chest from "../prefabs/Chest";
import Bullet from "../prefabs/Magazine";
import Magazine from "../prefabs/Magazine";

export default class GameScene extends Phaser.Scene {
  bulletCount: number;
  coordinatesCount: number;

  player;
  keys: object;
  wall: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
  background: Phaser.GameObjects.Image;
  bullets: Phaser.Physics.Arcade.Group;
  magazine: Phaser.Physics.Arcade.Image;
  /* magazines: Phaser.Physics.Arcade.Group; */
  /*  chests: Phaser.Physics.Arcade.Group; */
  goldPickupAudio: Phaser.Sound.BaseSound;

  constructor() {
    super("Game"); // Name of the scene
  }

  init() {
    /*   this.score = 12; */
    this.scene.launch("UI");
  }

  create() {
    /*    var angle = 0; */
    /*     this.bullets = this.physics.add.group(); */
    this.bulletCount = 24;
    this.coordinatesCount = 0;
    this.createBackground();
    this.createAudio();
    this.createWalls();
    /*     this.createChests(); */
    this.createMagazines();
    this.createPlayer();
    this.followPointer();
    this.addCollisions();
    this.createInput();
    this.createCameraFunctions();

    /* var player = this.player; */
    /*     this.input.on(
      "pointermove",
      function (pointer) {
        pointer.x = pointer.worldX;
        pointer.y = pointer.worldY;
        angle = Phaser.Math.Angle.BetweenPoints(player, pointer);
        player.rotation = angle;
      },
      this
    ); */
  }

  update() {
    this.player.update(this.keys);
  }

  createBackground() {
    this.background = this.add.image(0, 0, "background");
    this.background.setOrigin(0, 0);
    this.physics.world.setBounds(
      0,
      0,
      this.background.displayWidth,
      this.background.displayHeight
    );
    this.background.setInteractive();
    if (this.bulletCount > 0) {
      this.background.on("pointerup", this.makeBullet, this);
    }
  }

  makeBullet() {
    if (this.bulletCount > 0) {
      this.bulletCount--;
      this.events.emit("updateScore", this.bulletCount);
      this.bullets = this.physics.add.group();
      var dirObj = this.getDirFromAngle(this.player.angle);
      var bullet = this.physics.add.sprite(
        this.player.x + dirObj.tx * 30,
        this.player.y + dirObj.ty * 30,
        "bullet"
      );
      this.bullets.add(bullet);
      bullet.angle = this.player.angle;
      bullet.body.setVelocity(dirObj.tx * 800, dirObj.ty * 800);
    }
  }

  getDirFromAngle(angle) {
    var rads = (angle * Math.PI) / 180;
    var tx = Math.cos(rads);
    var ty = Math.sin(rads);
    return { tx, ty };
  }

  createCameraFunctions() {
    this.cameras.main.setBounds(
      0,
      0,
      this.background.displayWidth,
      this.background.displayHeight
    );
    this.cameras.main.startFollow(this.player, true);
  }
  createPlayer() {
    this.player = new Player(
      this,
      this.background.width / 2,
      this.background.height / 2,
      "soldierPlayer"
    );
    this.player.setScale(0.3);
  }

  createInput() {
    this.keys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });
  }

  followPointer() {
    var angle = 0;
    var player = this.player;
    this.input.on(
      "pointermove",
      function (pointer) {
        pointer.x = pointer.worldX;
        pointer.y = pointer.worldY;
        angle = Phaser.Math.Angle.BetweenPoints(player, pointer);
        player.rotation = angle;
      },
      this
    );
  }

  createWalls() {
    this.wall = this.physics.add.image(900, 100, "button1");
    this.wall.setCollideWorldBounds(true);
    this.wall.setImmovable();
  }

  addCollisions() {
    this.physics.add.collider(this.player, this.wall);
    /* this.physics.add.overlap(
      this.player,
      this.chests,
      this.collectChest,
      null,
      this
    ); */
    this.physics.add.overlap(
      this.player,
      this.magazine,
      this.collectMagazine,
      null,
      this
    );
  }

  createAudio() {
    this.goldPickupAudio = this.sound.add("goldSound");
  }

  /* createChests() {
    this.chests = this.physics.add.group();
    let maxChests = 5;
    let chestLocations = [
      [100, 100],
      [500, 300],
      [100, 900],
      [900, 100],
      [900, 500],
    ];
    for (let i = 0; i < maxChests; i++) {
      this.spawnChest(chestLocations[i]);
    }
  } */

  createMagazines() {
    this.magazine = this.physics.add.image(400, 400, "cone");
    this.magazine.setActive(true);
    this.magazine.setVisible(true);
    this.magazine.body.checkCollision.none = false;
  }

  spawnMagazine(coordinates) {
    this.magazine.setPosition(coordinates[0], coordinates[1]);
    this.magazine.setActive(true);
    this.magazine.setVisible(true);
    this.magazine.body.checkCollision.none = false;
  }

  collectMagazine(player, magazine) {
    let coordinates = [
      [100, 100],
      [200, 200],
      [300, 300],
    ];
    this.bulletCount += 12;
    this.goldPickupAudio.play();
    this.events.emit("updateScore", this.bulletCount);

    magazine.setActive(false);
    magazine.setVisible(false);
    magazine.body.checkCollision.none = true;

    this.spawnMagazine(coordinates[this.coordinatesCount]);
    this.coordinatesCount++;

    if (this.coordinatesCount > 2) {
      this.coordinatesCount = 0;
    }
  }

  /* spawnChest(location) {
    let chest = this.chests.getFirstDead();
    if (chest) {
      chest.setPosition(location[0], location[1]);
      chest.makeActive();
      this.chests.add(chest);
    } else {
      this.chests.add(new Chest(this, location[0], location[1], "items", 0));
    }
  } */

  /* collectChest(player, chest) {
    this.bulletCount += chest.coins;
    this.goldPickupAudio.play();
    this.events.emit("updateScore", this.bulletCount);
    this.time.delayedCall(
      1000,
      () => {
        this.spawnChest([chest.x, chest.y]);
      },
      [],
      this
    );
    chest.makeInactive();
    /*     this.time.delayedCall(
      3000,
      () => {
        chest.makeActive();
      },
      [],
      this
    ); */
  //}
}
