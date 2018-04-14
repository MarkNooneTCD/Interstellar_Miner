// Necessary Game constants
const mvmtSpeed = 5;
const fireRate = 100;
const gameWidth = window.innerWidth;
const gameHeight = window.innerHeight;
const mapWidth = 5000;
const mapHeight = 5000;
const meteorChildSpawnMax = 6;
const meteorChildSpawnMin = 3;
const asteroidOffset = 4;
// Create Groups
let asteroids;

// Create sprite variables
let fighter ;

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
    Interstellar.load.image('health-100', 'assets/images/health/100-bar.png');
    Interstellar.load.image('health-90', 'assets/images/health/90-bar.png');
    Interstellar.load.image('health-80', 'assets/images/health/80-bar.png');
    Interstellar.load.image('health-70', 'assets/images/health/70-bar.png');
    Interstellar.load.image('health-60', 'assets/images/health/60-bar.png');
    Interstellar.load.image('health-50', 'assets/images/health/50-bar.png');
    Interstellar.load.image('health-40', 'assets/images/health/40-bar.png');
    Interstellar.load.image('health-30', 'assets/images/health/30-bar.png');
    Interstellar.load.image('health-20', 'assets/images/health/20-bar.png');
    Interstellar.load.image('health-10', 'assets/images/health/10-bar.png');
    Interstellar.load.image('health-0', 'assets/images/health/0-bar.png');
}

function create() {

    Interstellar.physics.startSystem(Phaser.Physics.ARCADE);
    // Interstellar.physics.startSystem(Phaser.Physics.P2JS);
    fireButton = Interstellar.input.activePointer.leftButton;

    this.spaceBackground = Interstellar.add.tileSprite(0, 0, mapWidth, mapHeight, 'space');
    Interstellar.world.setBounds(0, 0, mapWidth, mapHeight);

    // Create the fighter ship
    fighter = Interstellar.add.sprite(400, 300, 'fighter');
    // fighter = Interstellar.add.sprite(Interstellar.world.centerX, Interstellar.world.centerY, 'fighter');
    fighter.anchor.setTo(0.5, 0.5);
    fighter.scale.setTo(.4, .4);

    createAsteroids();

    // Physics Handling
    Interstellar.physics.enable(fighter, Phaser.Physics.ARCADE);
    Interstellar.camera.follow(fighter, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);

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

function createAsteroids(){
  asteroids = Interstellar.add.group();

  let asteroidObject = Interstellar.add.sprite(800, 300, 'health-100');
  asteroidObject.anchor.setTo(0, 0);
  asteroidObject.scale.setTo(1.3, 1.3);
  Interstellar.physics.arcade.enable(asteroidObject);
  asteroidObject.body.setCircle(30, -14, 14); // Set body to circle with radius, xOffset
  let tmp = asteroidObject.addChild(Interstellar.make.sprite(15, 45, 'asteroid'));
  tmp.anchor.setTo(0.5, 0.5);

  asteroids.add(asteroidObject);

  // asteroid.events.onKilled.add(() => {
  //   progress.kill();
  //
  //   // Spawn child meteors
  //   var tmp = Interstellar.add.group();
  //   tmp.enableBody = true;
  //   tmp.physicsBodyType = Phaser.Physics.ARCADE;
  //   tmp.createMultiple(Math.floor(Math.random() * meteorChildSpawnMax) + meteorChildSpawnMin, 'asteroid');
  //   tmp.setAll('anchor.x', 0.5);
  //   tmp.setAll('anchor.y', 0.5);
  //   tmp.setAll('scale.x', .65);
  //   tmp.setAll('scale.y', .65);
  //   tmp.setAll('outOfBoundsKill', true);
  //   tmp.setAll('checkWorldBounds', true);
  //
  //   // Generate random X and Y on the circle around original asteroid.
  //   tmp.forEach((asteroid)=>{
  //     let radius = 50;
  //     let tmpAngle = Math.random()*Math.PI*2;
  //     asteroid.x = Math.cos(tmpAngle)*radius;
  //     asteroid.y = Math.sin(tmpAngle)*radius;
  //   });
  //   asteroids.add(tmp);
  //
  // }, this);
}

function update() {
    fighter.rotation = Interstellar.physics.arcade.angleToPointer(fighter);
    asteroids.forEachAlive((item) => {
      item.getChildAt(0).angle += .5;
      Interstellar.physics.arcade.overlap(bullets, item, asteroidCollisionHandler, null, this);
    });
    movementWASD();
    if (fireButton.isDown)
    {
        fireBullet();
    }
}

function asteroidCollisionHandler (asteroid, bullet) {
    bullet.kill(); // Destroy The bullet on hit
    damageAsteroid(asteroid, 0.1);
}

function damageAsteroid(asteroid, damage){
  asteroid.damage(damage);

  // Change the health bar depending on damage
  if(asteroid.health >= 0.9 && asteroid.health < 1){
    asteroid.loadTexture('health-90', 0);
  } else if(asteroid.health >= 0.8 && asteroid.health < .9){
    asteroid.loadTexture('health-80', 0);
  } else if(asteroid.health >= 0.7 && asteroid.health < .8){
    asteroid.loadTexture('health-70', 0);
  } else if(asteroid.health >= 0.6 && asteroid.health < .7){
    asteroid.loadTexture('health-60', 0);
  } else if(asteroid.health >= 0.5 && asteroid.health < .6){
    asteroid.loadTexture('health-50', 0);
  } else if(asteroid.health >= 0.4 && asteroid.health < .5){
    asteroid.loadTexture('health-40', 0);
  } else if(asteroid.health >= 0.3 && asteroid.health < .4){
    asteroid.loadTexture('health-30', 0);
  } else if(asteroid.health >= 0.2 && asteroid.health < .3){
    asteroid.loadTexture('health-20', 0);
  } else if(asteroid.health >= 0.1 && asteroid.health < .2){
    asteroid.loadTexture('health-10', 0);
  } else if(asteroid.health >= 0 && asteroid.health < .1){
    asteroid.loadTexture('health-0', 0);
  }
}

function render() {
    Interstellar.debug.spriteInfo(fighter, 32, 32);
    // Interstellar.debug.body(asteroids.getChildAt(0));
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
