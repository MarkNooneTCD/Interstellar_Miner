// Necessary Game constants
const mvmtSpeed = 5;
const fireRate = 100;
const gameWidth = window.innerWidth;
const gameHeight = window.innerHeight;

// Create sprite variables
let fighter, asteroid, asteroidOffset = 4;

// Create Bullets Behaviour
let bullets, nextFire = 0, fireButton, bulletDamage = 10;

// Game Config
let spaceBackground;

var Interstellar = new Phaser.Game(gameWidth, gameHeight, Phaser.AUTO, '', {
  preload: preload,
  create: create,
  update: update,
  render: render
});

// Import Game Assets
function preload() {
    Interstellar.load.image('fighter', 'assets/sprites/fighter.png');
    Interstellar.load.image('bullet', 'assets/images/bullet.png');
    Interstellar.load.image('space', 'assets/images/space.jpg');
    Interstellar.load.image('asteroid', 'assets/images/asteroid.png');
}

function create() {

    Interstellar.physics.startSystem(Phaser.Physics.ARCADE);
    fireButton = Interstellar.input.activePointer.leftButton;

    this.spaceBackground = Interstellar.add.tileSprite(0, 0, Interstellar.width, Interstellar.height, 'space');

    // Create the fighter ship
    fighter = Interstellar.add.sprite(400, 300, 'fighter');
    fighter.anchor.setTo(0.5, 0.5);
    fighter.scale.setTo(.4, .4);

    // Create Asteroid
    asteroid = Interstellar.add.sprite(800, 300, 'asteroid');
    asteroid.anchor.setTo(0.5, 0.5);
    asteroid.scale.setTo(1.3, 1.3);

    // Physics Handling
    Interstellar.physics.enable([fighter, asteroid], Phaser.Physics.ARCADE);
    asteroid.body.setCircle(30, 2, -1); // Set body to circle with radius, xOffset

    // Bullets Group
    bullets = Interstellar.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(30, 'bullet');
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 1);
    bullets.setAll('scale.x', .5);
    bullets.setAll('scale.y', .5);
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('checkWorldBounds', true);

    //  Tell it we don't want physics to manage the rotation
    fighter.body.allowRotation = false;

}

function update() {
    fighter.rotation = Interstellar.physics.arcade.angleToPointer(fighter);
    asteroid.angle += .5;
    movementArrow();
    movementWASD();
    if (fireButton.isDown)
    {
        fireBullet();
    }

    // Bullet Collision Handlers
    Interstellar.physics.arcade.overlap(bullets, asteroid, asteroidCollisionHandler, null, this);
}

function asteroidCollisionHandler (asteroid, bullet) {
    //  When a bullet hits an alien we kill them both
    bullet.kill();

    //  And create an explosion :)
    // var explosion = explosions.getFirstExists(false);
    // explosion.reset(alien.body.x, alien.body.y);
    // explosion.play('kaboom', 30, false, true);
    //
    // if (aliens.countLiving() == 0)
    // {
    //     score += 1000;
    //     scoreText.text = scoreString + score;
    //
    //     enemyBullets.callAll('kill',this);
    //     stateText.text = " You Won, \n Click to restart";
    //     stateText.visible = true;
    //
    //     //the "click to restart" handler
    //     game.input.onTap.addOnce(restart,this);
    // }

}

function render() {
    Interstellar.debug.spriteInfo(fighter, 32, 32);
}

function movementArrow(){
  if (Interstellar.input.keyboard.isDown(Phaser.Keyboard.LEFT))
  {
      fighter.x -= mvmtSpeed;
  }
  else if (Interstellar.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
  {
      fighter.x += mvmtSpeed;
  }

  if (Interstellar.input.keyboard.isDown(Phaser.Keyboard.UP))
  {
      fighter.y -= mvmtSpeed;
  }
  else if (Interstellar.input.keyboard.isDown(Phaser.Keyboard.DOWN))
  {
      fighter.y += mvmtSpeed;
  }
}

function fireBullet () {


    //  To avoid them being allowed to fire too fast we set a time limit
    if (Interstellar.time.now > nextFire && bullets.countDead())
    {
        nextFire = Interstellar.time.now + fireRate;
        //  Grab the first bullet we can from the pool
        bullet = bullets.getFirstExists(false);
        var length = 30;
        //Add 2.5 in order to get the gun shooting from the middle
        var x = fighter.x+2.5 + (Math.cos(fighter.rotation) * length);
        var y = fighter.y + (Math.sin(fighter.rotation) * length);

        if (bullet)
        {
            //  And fire it
            bullet.reset(x, y);
            bullet.rotation = Interstellar.physics.arcade.angleToPointer(bullet);
            Interstellar.physics.arcade.moveToPointer(bullet, 700);
        }
    }

}

function movementWASD(){
  if (Interstellar.input.keyboard.isDown(Phaser.Keyboard.A))
  {
      fighter.x -= mvmtSpeed;
  }
  else if (Interstellar.input.keyboard.isDown(Phaser.Keyboard.D))
  {
      fighter.x += mvmtSpeed;
  }

  if (Interstellar.input.keyboard.isDown(Phaser.Keyboard.W))
  {
      fighter.y -= mvmtSpeed;
  }
  else if (Interstellar.input.keyboard.isDown(Phaser.Keyboard.S))
  {
      fighter.y += mvmtSpeed;
  }
}
