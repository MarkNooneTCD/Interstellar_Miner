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
let fighters

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
    Interstellar.load.image('shield', 'assets/images/spr_shield.png');
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
    Interstellar.load.image('health-0', 'assets/images/bars/0-bar-health.png');
    Interstellar.load.image('enemy-100', 'assets/images/bars/100-bar-enemy.png');
    Interstellar.load.image('enemy-90', 'assets/images/bars/90-bar-enemy.png');
    Interstellar.load.image('enemy-80', 'assets/images/bars/80-bar-enemy.png');
    Interstellar.load.image('enemy-70', 'assets/images/bars/70-bar-enemy.png');
    Interstellar.load.image('enemy-60', 'assets/images/bars/60-bar-enemy.png');
    Interstellar.load.image('enemy-50', 'assets/images/bars/50-bar-enemy.png');
    Interstellar.load.image('enemy-40', 'assets/images/bars/40-bar-enemy.png');
    Interstellar.load.image('enemy-30', 'assets/images/bars/30-bar-enemy.png');
    Interstellar.load.image('enemy-20', 'assets/images/bars/20-bar-enemy.png');
    Interstellar.load.image('enemy-10', 'assets/images/bars/10-bar-enemy.png');
    Interstellar.load.image('enemy-0', 'assets/images/bars/0-bar-enemy.png');
    Interstellar.load.image('shield-100', 'assets/images/bars/100-bar-shield.png');
    Interstellar.load.image('shield-90', 'assets/images/bars/90-bar-shield.png');
    Interstellar.load.image('shield-80', 'assets/images/bars/80-bar-shield.png');
    Interstellar.load.image('shield-70', 'assets/images/bars/70-bar-shield.png');
    Interstellar.load.image('shield-60', 'assets/images/bars/60-bar-shield.png');
    Interstellar.load.image('shield-50', 'assets/images/bars/50-bar-shield.png');
    Interstellar.load.image('shield-40', 'assets/images/bars/40-bar-shield.png');
    Interstellar.load.image('shield-30', 'assets/images/bars/30-bar-shield.png');
    Interstellar.load.image('shield-20', 'assets/images/bars/20-bar-shield.png');
    Interstellar.load.image('shield-10', 'assets/images/bars/10-bar-shield.png');
    Interstellar.load.image('shield-0', 'assets/images/bars/0-bar-shield.png');
}

function create() {

    Interstellar.physics.startSystem(Phaser.Physics.ARCADE);
    // Interstellar.physics.startSystem(Phaser.Physics.P2JS);

    // Game Configurations
    fireButton = Interstellar.input.activePointer.leftButton;

    // World Configurations
    this.spaceBackground = Interstellar.add.tileSprite(0, 0, mapWidth, mapHeight, 'space');
    Interstellar.world.setBounds(0, 0, mapWidth, mapHeight);

    // Fighter Ships
    fighters = Interstellar.add.group();

    // Sprite Creation
    resources = Interstellar.add.group();
    createAsteroids();
    createBullets();
    createFighter(400, 300, true);
    createFighter(1400, 300, false);

}

function createFighter(shipX, shipY, isPlayer){
  let fighter = Interstellar.add.group();

  // Create the fighter ship
  let tmpFighter = Interstellar.add.sprite(shipX, shipY, 'fighter');
  tmpFighter.anchor.setTo(0.5, 0.5);
  tmpFighter.scale.setTo(.4, .4);
  tmpFighter.xSpeed=0;
  tmpFighter.ySpeed=0;

  let tmpHealthBar = Interstellar.add.sprite(shipX, shipY+62, 'health-100');
  tmpHealthBar.anchor.setTo(0.5, 0.5);
  tmpHealthBar.scale.setTo(1.5, 1.3);
  tmpFighter.healthBar = tmpHealthBar;

  // Create shield
  let tmpShield = Interstellar.add.sprite(shipX, shipY, 'shield');
  tmpShield.anchor.setTo(0.5, 0.5);
  tmpShield.scale.setTo(0.15, 0.15);
  tmpShield.associatedShipSprite = tmpFighter;
  tmpShield.lastCollision = null;
  tmpShield.timeout = null;
  tmpShield.events.onKilled.add(() => {
    console.log("Shield dead.");
  });
  tmpShield.alpha = 0;

  let tmpShieldBar = Interstellar.add.sprite(shipX, shipY+50, 'shield-100');
  tmpShieldBar.anchor.setTo(0.5, 0.5);
  tmpShieldBar.scale.setTo(1.5, 1.3);
  tmpShield.shieldBar = tmpShieldBar;


  // Physics Handling
  Interstellar.physics.enable(tmpFighter, Phaser.Physics.ARCADE);
  Interstellar.physics.arcade.enable(tmpShield);

  // Camera follow only player
  if(isPlayer)
    Interstellar.camera.follow(tmpFighter, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);

  tmpShield.body.setCircle(275, 0, 0);

  //  Tell it we don't want physics to manage the rotation
  tmpFighter.body.allowRotation = false;
  tmpFighter.events.onKilled.add(()=>{
    tmpShield.kill();
    tmpHealthBar.kill();
    tmpShieldBar.kill();
    fighters.remove(fighter);
  });

  fighter.add(tmpFighter);
  fighter.add(tmpShield);
  fighter.add(tmpHealthBar);
  fighter.add(tmpShieldBar);

  fighters.add(fighter);

}

function createBullets(){
  // Bullets Group
  bullets = Interstellar.add.group();
  bullets.enableBody = true;
  bullets.physicsBodyType = Phaser.Physics.ARCADE;
  bullets.createMultiple(30, 'bullet');
  bullets.forEach((item)=> {
    item.sourceShield = null;
    item.sourceShip = null;
    item.anchor.x = 0.5;
    item.anchor.y = 1;
    item.scale.x = .5;
    item.scale.y = .5;
    item.outOfBoundsKill = true;
    item.checkWorldBounds = true;
  });

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
    let i = 0;
    fighters.forEachAlive((item)=> {
        let ship = item.getChildAt(0);
        let shield = item.getChildAt(1);
        let health = item.getChildAt(2);
        let shieldBar = item.getChildAt(3);
        if(i === 0)
          updatePlayer(ship, shield);
        Interstellar.physics.arcade.overlap(shield, bullets, shieldBulletHandler, null, this);
        Interstellar.physics.arcade.overlap(ship, resources, resourceHandler, null, this);
        Interstellar.physics.arcade.overlap(asteroids, shield, shieldAsteroidCollision, null, this);
        Interstellar.physics.arcade.overlap(bullets, ship, shipShotHandler, null, this);
        shield.x = ship.x;
        shield.y = ship.y;
        health.x = ship.x;
        health.y = ship.y +62;
        shieldBar.x = ship.x;
        shieldBar.y = ship.y +50;
        i++;
    });

    asteroids.forEachAlive((item) => {
      item.getChildAt(0).angle += .5;
      Interstellar.physics.arcade.overlap(bullets, item, asteroidCollisionHandler, null, this);
    });
    resources.forEachAlive((item)=>{
      item.angle += -.5;
    });
}

//TODO: Needs some serious work
function shieldAsteroidCollision(shield, asteroid){
  if(!(shield.lastCollison === asteroid)){
    console.log("Inside");
    let ship = shield.associatedShipSprite;
    if(ship.xSpeed < 0.1){
      ship.xSpeed =0;
    } else{
      ship.xSpeed = -ship.xSpeed*0.5;
    }
    if(ship.ySpeed < 0.1){
      ship.ySpeed =0;
    } else{
      ship.ySpeed = -ship.ySpeed*0.5;
    }

    damageAsteroid(asteroid, .2);
    // damageShield(shield, .5);
    shield.lastCollison = asteroid;
    setTimeout(()=>{
      shield.lastCollison = null;
    }, 200);
  } else {
    console.log("out");
    return;
  }

}

function updatePlayer(playerShip, playerShield){
  playerShip.rotation = Interstellar.physics.arcade.angleToPointer(playerShip);
  movementWASDNonAngularVelocity(playerShip);
  if (fireButton.isDown)
  {
      fireBullet(playerShip, playerShield);
  }
}
function shipShotHandler(ship, bullet){
  if(bullet.sourceShip === ship)
    return;
  bullet.kill();
  damageShip(ship, 0.25);
}

function shieldBulletHandler(shield, bullet){
  if(bullet.sourceShield === shield)
    return;
  bullet.kill();
  damageShield(shield, 0.15);
}

function damageShip(ship, value){
  ship.damage(value);
  // Change the health bar depending on damage
  if(ship.health >= 0.9 && ship.health < 1){
    ship.healthBar.loadTexture('health-90', 0);
  } else if(ship.health >= 0.8 && ship.health < .9){
    ship.healthBar.loadTexture('health-80', 0);
  } else if(ship.health >= 0.7 && ship.health < .8){
    ship.healthBar.loadTexture('health-70', 0);
  } else if(ship.health >= 0.6 && ship.health < .7){
    ship.healthBar.loadTexture('health-60', 0);
  } else if(ship.health >= 0.5 && ship.health < .6){
    ship.healthBar.loadTexture('health-50', 0);
  } else if(ship.health >= 0.4 && ship.health < .5){
    ship.healthBar.loadTexture('health-40', 0);
  } else if(ship.health >= 0.3 && ship.health < .4){
    ship.healthBar.loadTexture('health-30', 0);
  } else if(ship.health >= 0.2 && ship.health < .3){
    ship.healthBar.loadTexture('health-20', 0);
  } else if(ship.health >= 0.1 && ship.health < .2){
    ship.healthBar.loadTexture('health-10', 0);
  } else if(ship.health >= 0 && ship.health < .1){
    ship.healthBar.loadTexture('health-0', 0);
  }
}

function damageShield(shield, value) {
  shield.damage(value);
  shield.alpha = 100;
  clearTimeout(shield.timeout);
  shield.timeout = setTimeout(()=>{
    shield.alpha = 0;
  }, 80);

  // Change the shield bar depending on damage
  if(shield.health >= 0.9 && shield.health < 1){
    shield.shieldBar.loadTexture('shield-90', 0);
  } else if(shield.health >= 0.8 && shield.health < .9){
    shield.shieldBar.loadTexture('shield-80', 0);
  } else if(shield.health >= 0.7 && shield.health < .8){
    shield.shieldBar.loadTexture('shield-70', 0);
  } else if(shield.health >= 0.6 && shield.health < .7){
    shield.shieldBar.loadTexture('shield-60', 0);
  } else if(shield.health >= 0.5 && shield.health < .6){
    shield.shieldBar.loadTexture('shield-50', 0);
  } else if(shield.health >= 0.4 && shield.health < .5){
    shield.shieldBar.loadTexture('shield-40', 0);
  } else if(shield.health >= 0.3 && shield.health < .4){
    shield.shieldBar.loadTexture('shield-30', 0);
  } else if(shield.health >= 0.2 && shield.health < .3){
    shield.shieldBar.loadTexture('shield-20', 0);
  } else if(shield.health >= 0.1 && shield.health < .2){
    shield.shieldBar.loadTexture('shield-10', 0);
  } else if(shield.health >= 0 && shield.health < .1){
    shield.shieldBar.loadTexture('shield-0', 0);
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
    Interstellar.debug.spriteInfo(fighters.getChildAt(0).getChildAt(0), 32, 32);
    // Interstellar.debug.body(asteroids.getChildAt(0));
    resources.forEachAlive((item)=>{
      Interstellar.debug.body(item);
    });

}

function fireBullet (ship, shield) {
    //  To avoid them being allowed to fire too fast we set a time limit
    if (Interstellar.time.now > nextFire && bullets.countDead())
    {
        nextFire = Interstellar.time.now + fireRate;
        //  Grab the first bullet we can from the pool
        bullet = bullets.getFirstExists(false);
        var length = 30;
        //Add 2.5 in order to get the gun shooting from the middle
        var x = ship.x+2.5 + (Math.cos(ship.rotation) * length);
        var y = ship.y + (Math.sin(ship.rotation) * length);

        if (bullet)
        {
            //  And fire it
            bullet.reset(x, y);
            bullet.sourceShield = shield;
            bullet.sourceShip = ship;
            bullet.rotation = Interstellar.physics.arcade.angleToPointer(bullet);
            Interstellar.physics.arcade.moveToPointer(bullet, 700);
        }
    }

}

function movementWASDAngularVelocity(ship){
  if (Interstellar.input.keyboard.isDown(Phaser.Keyboard.W))
    {
        Interstellar.physics.arcade.accelerationFromRotation(ship.rotation, 200, ship.body.acceleration);
    }
    else
    {
        ship.body.acceleration.set(0);
    }

    if (Interstellar.input.keyboard.isDown(Phaser.Keyboard.A))
    {
        ship.body.angularVelocity = -200;
    }
    else if (Interstellar.input.keyboard.isDown(Phaser.Keyboard.D))
    {
        ship.body.angularVelocity = 200;
    }
    else
    {
        ship.body.angularVelocity = 0;
    }
}

function movementWASDNonAngularVelocity(ship){
  if (Interstellar.input.keyboard.isDown(Phaser.Keyboard.A))
  {
    if(ship.xSpeed >= 0- maxSpeed){
      ship.xSpeed-=acceleration;
    }

  }
  else if (Interstellar.input.keyboard.isDown(Phaser.Keyboard.D))
  {
    if(ship.xSpeed <= maxSpeed){
      ship.xSpeed+=acceleration;
    }
  } else if(!(Interstellar.input.keyboard.isDown(Phaser.Keyboard.A) && Interstellar.input.keyboard.isDown(Phaser.Keyboard.D))){
    if(ship.xSpeed<0)
      ship.xSpeed += slowDown;
    else
      ship.xSpeed -= slowDown;
  }

  if (Interstellar.input.keyboard.isDown(Phaser.Keyboard.W))
  {
    if(ship.ySpeed >= 0-maxSpeed){
      ship.ySpeed-=acceleration;
    }
  }
  else if (Interstellar.input.keyboard.isDown(Phaser.Keyboard.S))
  {
    if(ship.ySpeed <= maxSpeed){
      ship.ySpeed+=acceleration;
    }
  } else if(!(Interstellar.input.keyboard.isDown(Phaser.Keyboard.W) && Interstellar.input.keyboard.isDown(Phaser.Keyboard.S))){
    if(ship.ySpeed<0)
      ship.ySpeed += slowDown;
    else
      ship.ySpeed -= slowDown;
  }
  ship.x += ship.xSpeed;
  ship.y += ship.ySpeed;
}
