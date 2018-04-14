// Necessary Game constants
const mvmtSpeed = 5;
const fireRate = 300;
const gameWidth = window.innerWidth;
const gameHeight = window.innerHeight;
const acceleration = .2;
const slowDown = 0.03;
const maxSpeed = 5;
const mapWidth = 5000;
const mapHeight = 5000;
const meteorChildSpawnMax = 3;
const meteorChildSpawnMin = 1;
const asteroidOffset = 4;
// Create Groups
let asteroids, resources;

// Create sprite variables
let fighter, xSpeed=0, ySpeed=0;

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
    Interstellar.load.image('gold', 'assets/images/resources/gold.png');
    Interstellar.load.image('health-100', 'assets/images/bars/100-bar-health.png');
    Interstellar.load.image('health-90', 'assets/images/bars/90-bar-health.png');
    Interstellar.load.image('health-80', 'assets/images/bars/80-bar-health.png');
    Interstellar.load.image('health-70', 'assets/images/bars/70-bar-health.png');
    Interstellar.load.image('health-60', 'assets/images/bars/60-bar-health.png');
    Interstellar.load.image('health-50', 'assets/images/bars/50-bar-health.png');
    Interstellar.load.image('health-40', 'assets/images/bars/40-bar-health.png');
    Interstellar.load.image('health-30', 'assets/images/bars/30-bar-health.png');
    Interstellar.load.image('health-20', 'assets/images/bars/20-bar-health.png');
    Interstellar.load.image('health-10', 'assets/images/bars/10-bar-health.png');
    Interstellar.load.image('health-0', 'assets/images/health/0-bar-health.png');
}

function create() {

    Interstellar.physics.startSystem(Phaser.Physics.ARCADE);
    // Interstellar.physics.startSystem(Phaser.Physics.P2JS);
    fireButton = Interstellar.input.activePointer.leftButton;
    // resources.physicsBodyType = Phaser.Physics.ARCADE;
    // resources.enableBody = true;

    this.spaceBackground = Interstellar.add.tileSprite(0, 0, mapWidth, mapHeight, 'space');
    Interstellar.world.setBounds(0, 0, mapWidth, mapHeight);

    resources = Interstellar.add.group();

    // Create the fighter ship
    fighter = Interstellar.add.sprite(400, 300, 'fighter');

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

  asteroidObject.events.onKilled.add(() => {
    let rand = Math.floor(Math.random() * meteorChildSpawnMax) + meteorChildSpawnMin
    for(let i = 0; i <= rand; i++){
      let angle = Math.random()*Math.PI*2;
      let rx = Math.cos(angle)*60;
      let ry = Math.sin(angle)*60;
      let spawn = Interstellar.add.sprite(800, 300, 'health-100');
      spawn.anchor.setTo(0, 0);
      spawn.x += rx;
      spawn.y += ry;
      spawn.scale.setTo(.6, .6);
      Interstellar.physics.arcade.enable(spawn);
      spawn.body.setCircle(30, -14, 14); // Set body to circle with radius, xOffset
      let spawnTmp = spawn.addChild(Interstellar.make.sprite(15, 45, 'asteroid'));
      spawnTmp.anchor.setTo(0.5, 0.5);

      spawn.events.onKilled.add(() => {
        let r = 1;//Math.floor(Math.random() * 3)+1;
        let resource;
        switch(r){
          case 1:
            resource = Interstellar.add.sprite(spawn.x, spawn.y, 'gold');
            resource.scale.setTo(1.3, 1.3);
            resource.anchor.setTo(0.5, 0.5);
            Interstellar.physics.arcade.enable(resource);
            resource.body.setCircle(6, 0, 0);
            resources.add(resource);
            break;
          case 2:
            break;
          case 3:
            break;
          default:
        }
      });

      asteroids.add(spawn);
    }
  }, this);

  asteroids.add(asteroidObject);
}

function update() {
    fighter.rotation = Interstellar.physics.arcade.angleToPointer(fighter);
    asteroids.forEachAlive((item) => {
      item.getChildAt(0).angle += .5;
      Interstellar.physics.arcade.overlap(bullets, item, asteroidCollisionHandler, null, this);
    });
    Interstellar.physics.arcade.overlap(fighter, resources, resourceHandler, null, this);
    resources.forEachAlive((item)=>{
      item.angle += -.5;
    });
    movementWASDNonAngularVelocity();
    if (fireButton.isDown)
    {
        fireBullet();
    }
}

function resourceHandler(fighter, resource) {
  resource.kill();
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
    Interstellar.debug.body(asteroids);
    resources.forEachAlive((item)=>{
      Interstellar.debug.body(item);
    });

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

function movementWASDAngularVelocity(){
  if (Interstellar.input.keyboard.isDown(Phaser.Keyboard.W))
    {
        Interstellar.physics.arcade.accelerationFromRotation(fighter.rotation, 200, fighter.body.acceleration);
    }
    else
    {
        fighter.body.acceleration.set(0);
    }

    if (Interstellar.input.keyboard.isDown(Phaser.Keyboard.A))
    {
        fighter.body.angularVelocity = -200;
    }
    else if (Interstellar.input.keyboard.isDown(Phaser.Keyboard.D))
    {
        fighter.body.angularVelocity = 200;
    }
    else
    {
        fighter.body.angularVelocity = 0;
    }
}

function movementWASDNonAngularVelocity(){
  if (Interstellar.input.keyboard.isDown(Phaser.Keyboard.A))
  {
    if(xSpeed >= 0- maxSpeed){
      xSpeed-=acceleration;
    }

  }
  else if (Interstellar.input.keyboard.isDown(Phaser.Keyboard.D))
  {
    if(xSpeed <= maxSpeed){
      xSpeed+=acceleration;
    }
  } else if(!(Interstellar.input.keyboard.isDown(Phaser.Keyboard.A) && Interstellar.input.keyboard.isDown(Phaser.Keyboard.D))){
    if(xSpeed<0)
      xSpeed += slowDown;
    else
      xSpeed -= slowDown;
  }

  if (Interstellar.input.keyboard.isDown(Phaser.Keyboard.W))
  {
    if(ySpeed >= 0-maxSpeed){
      ySpeed-=acceleration;
    }
  }
  else if (Interstellar.input.keyboard.isDown(Phaser.Keyboard.S))
  {
    if(ySpeed <= maxSpeed){
      ySpeed+=acceleration;
    }
  } else if(!(Interstellar.input.keyboard.isDown(Phaser.Keyboard.W) && Interstellar.input.keyboard.isDown(Phaser.Keyboard.S))){
    if(ySpeed<0)
      ySpeed += slowDown;
    else
      ySpeed -= slowDown;
  }
  fighter.x += xSpeed;
  fighter.y +=ySpeed;
}
