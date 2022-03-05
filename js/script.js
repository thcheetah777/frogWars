// Frog Wars
/*^*^*^*^*^*^*^*
script.js
The main script for Frog Wars.
*^*^*^*^*^*^*^*/

// ********** Game Scene **********
let game = {
  width: 17,
  height: 7,
  TILESIZE: 64,
  topMargin: 167,
  sfx: {},
  frogTypes: {
    "cannon": {
      path: "cannonFrog0",
      name: "cannon"
    },
    "basic": {
      path: "basicFrog0",
      name: "basic"
    },
    "launcher": {
      path: "launcherFrog",
      name: "launcher"
    },
    "toad": {
      path: "toad",
      name: "toad"
    },
    "water": {
      path: "waterFrog0",
      name: "water"
    },
    "bird": {
      path: "bird0",
      name: "bird"
    }
  },
  robotTypes: {
    normalRobot: {
      speed: 0.6,
      health: 5
    },
    armoredRobot: {
      speed: 0.6,
      health: 10
    },
    speedRobot: {
      speed: 1.8,
      health: 3
    },
    cannonRobot: {
      speed: 0.3,
      health: 5
    }
  },
  currencies: {
    flies: 0,
    lilyPads: 0
  },
  currentSelection: "cannon",
  projectileStats: {
    "cannon": {
      damage: 1
    },
    "launcher": {
      damage: 0.5
    },
    "water": {
      damage: 1
    }
  }
};
class Game extends Phaser.Scene {
  constructor() {
    super("Game");
  }
  preload() {
    // ********** Images **********
    // ---------- Frogs ----------
    this.load.image("basicFrog0", "assets/basicFrog0.png");
    this.load.image("basicFrog1", "assets/basicFrog1.png");
    this.load.image("basicFrog2", "assets/basicFrog2.png");
    this.load.image("basicFrog3", "assets/basicFrog3.png");
    this.load.image("cannonFrog0", "assets/cannonFrog0.png");
    this.load.image("cannonFrog1", "assets/cannonFrog1.png");
    this.load.image("cannonProjectile", "assets/cannonProjectile.png");
    this.load.image("launcherFrog", "assets/launcherFrog.png");
    this.load.image("launcherProjectile", "assets/launcherProjectile.png");
    this.load.image("toad", "assets/toad.png");
    this.load.image("waterFrog0", "assets/waterFrog0.png");
    this.load.image("waterFrog1", "assets/waterFrog1.png");
    this.load.image("water", "assets/water.png");

    // ---------- Robots ----------
    this.load.image("basicRobot0", "assets/basicRobot0.png");
    this.load.image("basicRobot1", "assets/basicRobot1.png");
    this.load.image("hurtRobot", "assets/hurtRobot.png");
    this.load.image("armoredRobot0", "assets/armoredRobot0.png");
    this.load.image("armoredRobot1", "assets/armoredRobot1.png");
    this.load.image("speedRobot0", "assets/speedRobot0.png");
    this.load.image("speedRobot1", "assets/speedRobot1.png");
    this.load.image("hurtSpeedRobot", "assets/speedRobot2.png");
    this.load.image("cannonRobot0", "assets/cannonRobot0.png");
    this.load.image("cannonRobot1", "assets/cannonRobot1.png");
    this.load.image("hurtCannonRobot", "assets/hurtCannonRobot.png");

    // ---------- Other ----------
    this.load.image("tile0", "assets/tile0.png");
    this.load.image("tile1", "assets/tile1.png");
    this.load.image("tile0select", "assets/tile0select.png");
    this.load.image("tile1select", "assets/tile1select.png");
    this.load.image("explosion0", "assets/explosion0.png");
    this.load.image("explosion1", "assets/explosion1.png");
    this.load.image("explosion2", "assets/explosion2.png");
    this.load.image("explosion3", "assets/explosion3.png");
    this.load.image("bird0", "assets/bird0.png");
    this.load.image("bird1", "assets/bird1.png");
    this.load.image("cursor", "assets/cursor.png");

    // ********** Sounds **********
    // ---------- Music ----------
    this.load.audio("music1-10", "assets/music1-10.mp3");

    // ---------- SFX ----------
    this.load.audio("cannonFrogShoot", "assets/cannonFrogShoot.wav");
    this.load.audio("launcherFrogShoot", "assets/launcherFrogShoot.wav");
    this.load.audio("robotDie", "assets/robotDie.wav");
    this.load.audio("robotHit", "assets/robotHit.wav");
    this.load.audio("basicFrogJump", "assets/basicFrogJump.wav");
  }
  create() {
    this.engine = new Engine(this);

    // Add sounds
    game.sfx.cannonFrogShoot = this.sound.add("cannonFrogShoot");
    game.sfx.launcherFrogShoot = this.sound.add("launcherFrogShoot");
    game.sfx.robotDie = this.sound.add("robotDie");
    game.sfx.robotHit = this.sound.add("robotHit");
    game.sfx.basicFrogJump = this.sound.add("basicFrogJump");
    game.sfx.music1 = this.sound.add("music1-10").setLoop(true);
    game.sfx.music1.play({ volume: 2 });

    // Create cursor
    this.engine.mouseInput();
    game.cursor = this.physics.add.sprite(this.input.mousePointer.x, this.input.mousePointer.y, "cursor").setScale(8).setGravityY(-1500).setSize(2, 2).setOffset(0, 0).setOrigin(0, 0);
    game.cursor.setDepth(1);

    // Create tiles
    game.tiles = this.physics.add.staticGroup();
    let tileCount = 0;
    for (var x = game.TILESIZE / 2; x < game.width * game.TILESIZE; x += game.TILESIZE) {
      for (var y = (game.TILESIZE / 2) + game.topMargin; y < (game.height * game.TILESIZE) + game.topMargin; y += game.TILESIZE) {
        if (tileCount % 2 == 0) {
          let tile = game.tiles.create(x, y, "tile0").setScale(8).setInteractive();
          tile.textureKey = "tile0";
        } else {
          let tile = game.tiles.create(x, y, "tile1").setScale(8).setInteractive();
          tile.textureKey = "tile1";
        }
        tileCount++;
      }
    }

    // Create choices to put in game
    game.choices = this.physics.add.staticGroup();
    let frogCount = 0;
    const frogs = ["cannon", "basic", "launcher", "toad", "water", "bird"];
    for (var x = (game.TILESIZE / 2) + 50; x < (game.TILESIZE * (Object.keys(game.frogTypes).length + 1)) + 50; x += game.TILESIZE + 10) {
      let choice = game.choices.create(x, game.TILESIZE, game.frogTypes[Object.keys(game.frogTypes)[frogCount]].path).setScale(8).setInteractive();
      choice.frogType = game.frogTypes[Object.keys(game.frogTypes)[frogCount]].name;
      frogCount++;
    }

    // Create groups
    game.frogs = this.physics.add.group();
    game.robots = this.physics.add.group();
    game.projectiles = this.physics.add.group();
    game.cannonRobotProjectiles = this.physics.add.group();
    game.removalBirds = this.physics.add.group();

    // ---------- Animation ----------
    // Walking
    this.engine.addAnimation("basicRobotWalk", 5, false, false, "basicRobot0", "basicRobot1");
    this.engine.addAnimation("armoredRobotWalk", 5, false, false, "armoredRobot0", "armoredRobot1");
    this.engine.addAnimation("speedRobotWalk", 5, false, false, "speedRobot0", "speedRobot1");
    this.engine.addAnimation("cannonRobotWalk", 5, false, false, "cannonRobot0", "cannonRobot1");

    // Other
    this.engine.addAnimation("jump", 10, false, false, "basicFrog0", "basicFrog1", "basicFrog2", "basicFrog0");
    this.engine.addAnimation("shootCannonball", 5, false, true, "cannonFrog0", "cannonFrog1");
    this.engine.addAnimation("explode", 10, false, false, "explosion0", "explosion1", "explosion2", "explosion3");
    this.engine.addAnimation("shootWater", 5, false, true, "waterFrog0", "waterFrog1");

    // ---------- Interaction ----------
    game.tiles.getChildren().forEach(tile => {
      tile.on("pointerover", () => {
        tile.setTexture(tile.textureKey + "select");
      });
      tile.on("pointerout", () => {
        tile.setTexture(tile.textureKey);
      });
      tile.on("pointerdown", (pointer) => {
        if (!tile.frog) {
          if (game.currentSelection !== "bird") {
            let frog = game.frogs.create(tile.x, tile.y, game.frogTypes[game.currentSelection].path).setScale(8).setGravityY(-1500).setSize(7, 8).setOffset(0, 0).setImmovable();
            frog.type = game.currentSelection;
            frog.isDead = false;
            frog.touchedBird = false;
            tile.frog = frog;
          }
        } else {
          if (game.currentSelection === "bird" && !tile.frog.isDead) {
            let bird = game.removalBirds.create(0, tile.y - game.TILESIZE + (game.TILESIZE / 8), "bird1").setScale(8).setGravityY(-config.physics.arcade.gravity.y).setVelocityX(500).setSize(3, 8).setOffset(0, 0);
            bird.flipX = true;
            bird.touchedFrog = false;
            tile.frog.isDead = true;
          }
        }
      });
    });
    game.choices.getChildren().forEach(choice => {
      choice.on("pointerdown", () => {
        game.currentSelection = choice.frogType;
      });
    });

    // ---------- Colliders ----------
    game.frogRobotCollider = this.physics.add.collider(game.frogs, game.robots, (frog, robot) => {
      if (frog.type === "basicFrog0") {
        frog.destroy();
        let lastFrame = robot.texture.key;
        if (!robot.dead) {
          if (robot.type === "basic" || robot.type === "armored" && !robot.dead) {
            robot.setTexture("hurtRobot");
          } else if (robot.type === "speed") {
            robot.setTexture("hurtSpeedRobot");
          }
        }
        setTimeout(function() {
          robot.setTexture(lastFrame);
        }, 500);
        game.sfx.robotHit.play();
        robot.health -= 5;
        if (robot.health <= 0) {
          robot.body.enable = false;
          game.sfx.robotDie.play();
          robot.dead = true;
          robot.anims.play("explode", true);
          setTimeout(function() {
            robot.destroy();
          }, 300);
        }
      }
    });
    this.physics.add.overlap(game.projectiles, game.robots, (projectile, robot) => {
      projectile.destroy();
      let lastFrame = robot.texture.key;
      if (!robot.dead) {
        if (robot.type === "basic" || robot.type === "armored") {
          robot.setTexture("hurtRobot");
        } else if (robot.type === "speed") {
          robot.setTexture("hurtSpeedRobot");
        } else if (robot.type === "cannon") {
          robot.setTexture("hurtCannonRobot");
        }
      }
      setTimeout(function() {
        robot.setTexture(lastFrame);
      }, 500);
      game.sfx.robotHit.play();
      robot.health -= game.projectileStats[projectile.type].damage;
      if (projectile.type === "water" && robot.speed > 0.3) {
        robot.speed -= 0.05;
      }
      if (robot.health <= 0) {
        robot.body.enable = false;
        game.sfx.robotDie.play();
        robot.dead = true;
        robot.anims.play("explode", true);
        setTimeout(function() {
          robot.destroy();
        }, 300);
      }
    });
    this.physics.add.overlap(game.frogs, game.removalBirds, (frog, bird) => {
      if (frog.isDead) {
        bird.setVelocityX(0);
        bird.touchedFrog = true;
        frog.touchedBird = true;
        frog.body.enable = false;
      }
    });
    this.physics.add.overlap(game.cannonRobotProjectiles, game.frogs, (projectile, frog) => {
      projectile.destroy();
    });

    // ---------- Intervals ----------
    this.time.addEvent({
      delay: 1500,
      callback: () => {
        game.tiles.getChildren().forEach(tile => {
          let hasFrog = null;
          game.frogs.getChildren().forEach(frog => {
            if (frog.x == tile.x && frog.y == tile.y) {
              hasFrog = frog;
            }
          });
          tile.frog = hasFrog;
        });
        game.frogs.getChildren().forEach(frog => {
          switch (frog.type) {
            case "basic":
              game.sfx.basicFrogJump.play();
              frog.anims.play("jump", true);
              setTimeout(function() {
                frog.x += game.tiles.getChildren()[0].width * 8;
              }, 50);
              break;
            case "cannon":
              frog.anims.play("shootCannonball", true);
              setTimeout(function() {
                let projectile = game.projectiles.create(frog.x, frog.y, "cannonProjectile").setScale(8).setGravityY(-1500).setVelocityX(300);
                projectile.type = "cannon";
              }, 200);
              break;
            case "launcher":
              game.sfx.launcherFrogShoot.play();
              let numOfSprite = 5;
              for (var i = 0; i < numOfSprite; i++) {
                let projectile = game.projectiles.create(frog.x, frog.y, "launcherProjectile").setScale(8).setGravityY(-1500);
                projectile.type = "launcher";
                projectile.angle = i * 360 / numOfSprite;
                projectile.setVelocityX(300 * Math.cos(projectile.rotation - 67.5));
                projectile.setVelocityY(300 * Math.sin(projectile.rotation - 67.5));
                projectile.setSize(2, 2);
                projectile.setOffset(0, 0);
              }
              break;
            case "water":
              frog.anims.play("shootWater", true);
              setTimeout(function() {
                let projectile = game.projectiles.create(frog.x + 58, frog.y + 48, "water").setScale(8).setGravityY(-1500).setVelocityX(300).setSize(1, 1).setOffset(0, 0);
                projectile.type = "water";
              }, 100);
              break;
          }
        });
      },
      callbackScope: this,
      repeat: -1
    });
    this.time.addEvent({
      delay: this.engine.randomBetween(1000, 3000),
      callback: () => {
        let row = Math.floor(Math.random() * game.height);
        let randomPercentage = Math.random() * 100;
        let type;
        let health;
        let speed;
        if (randomPercentage < 50) {
          type = "basic";
          health = game.robotTypes.normalRobot.health;
          speed = game.robotTypes.normalRobot.speed;
        } else if (randomPercentage >= 50 && randomPercentage < 75) {
          type = "armored";
          health = game.robotTypes.armoredRobot.health;
          speed = game.robotTypes.armoredRobot.speed;
        } else if (randomPercentage >= 75 && randomPercentage < 87.5) {
          type = "speed";
          health = game.robotTypes.speedRobot.health;
          speed = game.robotTypes.speedRobot.speed;
        } else if (randomPercentage >= 87.5) {
          type = "cannon";
          health = game.robotTypes.cannonRobot.health;
          speed = game.robotTypes.cannonRobot.speed;
        }
        let robot = game.robots.create(game.width * game.TILESIZE, (game.TILESIZE / 2 + game.TILESIZE * row) + game.topMargin, `${type}Robot0`).setScale(8).setGravityY(-1500).setSize(4, 8).setOffset(2, 0);
        robot.type = type;
        robot.health = health;
        robot.speed = speed;
        robot.dead = false;
      },
      callbackScope: this,
      repeat: -1
    });
    this.time.addEvent({
      delay: 1500,
      callback: () => {
        game.robots.getChildren().forEach(robot => {
          if (robot.type === "cannon") {
            let projectile = game.cannonRobotProjectiles.create(robot.x - 40, robot.y + 20, "cannonProjectile").setScale(8).setGravityY(-1500).setVelocityX(-300);
            projectile.setSize(2, 2);
            projectile.setOffset(6, 2);
          }
        });
      },
      callbackScope: this,
      repeat: -1
    });
  }
  update() {
    game.cursor.x = this.input.mousePointer.x;
    game.cursor.y = this.input.mousePointer.y;
    game.robots.getChildren().forEach(robot => {
      if (!robot.dead) {
        robot.setVelocityX(-robot.speed * 45);
        switch (robot.type) {
          case "basic":
            robot.anims.play("basicRobotWalk", true);
            break;
          case "armored":
            robot.anims.play("armoredRobotWalk", true);
            break;
          case "speed":
            robot.anims.play("speedRobotWalk", true);
            break;
          case "cannon":
            robot.anims.play("cannonRobotWalk", true);
            break;
        }
      }
    });
    game.tiles.getChildren().forEach(tile => {
      let hasFrog = null;
      game.frogs.getChildren().forEach(frog => {
        if (frog.x == tile.x && frog.y == tile.y) {
          hasFrog = frog;
        }
      });
      tile.frog = hasFrog;
    });
    game.frogs.getChildren().forEach(frog => {
      if (frog.x > game.width * game.TILESIZE) {
        frog.destroy();
      }
      if (frog.touchedBird) {
        frog.y -= 8;
      }
    });
    game.removalBirds.getChildren().forEach(bird => {
      if (bird.x > game.width * game.TILESIZE) {
        bird.destroy();
      }
      if (bird.touchedFrog) {
        bird.y -= 8;
      }
    });
    game.projectiles.getChildren().forEach(projectile => {
      if (projectile.x > game.width * game.TILESIZE || projectile.y > (game.height * game.TILESIZE) + game.topMargin || projectile.y < game.topMargin) {
        projectile.destroy();
      }
    });
  }
}

// ********** Start Scene **********
class Start extends Phaser.Scene {
  constructor() {
    super("Start");
    this.sfx = {};
  }
  preload() {
    // ---------- Assets ----------
    this.load.image("picker", "assets/picker.png");
    this.load.image("title", "assets/title.png");
    this.load.image("start", "assets/start.png");
    this.load.audio("optionSelect", "assets/optionSelect.wav");
    this.load.audio("introMusic", "assets/introMusic.mp3");
    this.load.image("cursor", "assets/cursor.png");
  }
  create() {
    this.engine = new Engine(this);

    // Add sounds
    this.sfx.optionSelect = this.sound.add("optionSelect");
    this.sfx.introMusic = this.sound.add("introMusic").setLoop(true);
    this.sfx.introMusic.play({ volume: 2 });

    // Create cursor
    this.engine.mouseInput();
    game.cursor = this.physics.add.sprite(this.input.mousePointer.x, this.input.mousePointer.y, "cursor").setScale(8).setGravityY(-1500).setSize(2, 2).setOffset(0, 0).setOrigin(0, 0);
    game.cursor.setDepth(1);

    // Set background color
    this.engine.setBackgroundColor(this, "#ffffff");

    // Add title
    this.add.image(this.engine.gameWidthCenter + 32, 125, "title").setScale(8);

    // Picker group
    this.pickerGroup = this.physics.add.staticGroup();

    // Add start option
    let phaser = this;
    this.startButton = this.add.image(this.engine.gameWidthCenter + 16, 400, "start").setScale(8).setInteractive();
    this.startButton.on("pointerup", () => {
      phaser.sfx.optionSelect.play();
      phaser.sfx.introMusic.stop();
      phaser.scene.stop();
      phaser.scene.start("Game");
    });
    this.startButton.on("pointerover", () => {
      phaser.pickerGroup.create(phaser.startButton.x - 160, phaser.startButton.y - 8, "picker").setScale(8);
      phaser.pickerGroup.create(phaser.startButton.x + 100, phaser.startButton.y - 8, "picker").setScale(8).flipX = true;
    });
    this.startButton.on("pointerout", () => {
      phaser.pickerGroup.getChildren().forEach(picker => {
        picker.visible = false;
      });
    });
  }
  update() {
    game.cursor.x = this.input.mousePointer.x;
    game.cursor.y = this.input.mousePointer.y;
  }
}
