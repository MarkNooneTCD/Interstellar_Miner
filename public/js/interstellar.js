// TODO: Make All constants begin with capital letters.
// Necessary Game constants
const mvmtSpeed = 5;
const fireRate = 300;
const gameWidth = window.innerWidth;
const gameHeight = window.innerHeight;
const gameSize = gameWidth/100;
const acceleration = .2;
const slowDown = 0.03;
const maxSpeed = 5;
const mapWidth = 5000;
const mapHeight = 5000;
const meteorChildSpawnMax = 3;
const meteorChildSpawnMin = 1;
const asteroidOffset = 4;

// Minimap constants
const MiniMapWidth = 400;
const MiniMapHeight = 250;
const MiniMapPaddingRight = 30;
const MiniMapPaddingBottom = 20;
const MiniMapLineThickness = 3;
const UpdateScaleWidth = MiniMapWidth/mapWidth;
const UpdateScaleHeight = MiniMapHeight/mapHeight;
const ShipColor = 0xffffff;

// Faction Constants
const FactionColours = [ 0xa4b0be, 0xe74c3c, 0x27ae60 ];

// Create Groups
let asteroids, resources, planets;
let shields = [], ships = [], gameObjects = [], claimZones = [];

// Minimap
let miniMapContainer, resolution, renderTexture, miniMap, minimapContents;

// Create sprite variables
let fighters

// Create Bullets Behaviour
let bullets, nextFire = 0, fireButton, bulletDamage = 10;

// Game Config
let spaceBackground;

// Window events
window.onbeforeunload = function(e) {
  Client.disconnect();
};

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
    Interstellar.load.image('mini_map', 'assets/images/miniCircle.png');
    Interstellar.load.image('planet-1', 'assets/images/planets/planet-1.png');
    Interstellar.load.image('planet-2', 'assets/images/planets/planet-2.png');
    Interstellar.load.image('planet-3', 'assets/images/planets/planet-3.png');
    Interstellar.load.image('planet-4', 'assets/images/planets/planet-4.png');
    Interstellar.load.image('planet-5', 'assets/images/planets/planet-5.png');
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
    Interstellar.playersX = [];
    Interstellar.playersY = [];
    Interstellar.addNewPlayer = (id, username, x, y) => {
      if(username === Interstellar.playerUsername){
        Interstellar.playerId = id;
        createFighter(id, x, y, true, 1);
      }
      else
        createFighter(id, x, y, false, 2);
    };


    Interstellar.removePlayer = (id) => {
      fighters.forEach((item) => {
        if(item.id === id){
          item.getChildAt(0).kill();
        }
      });
    };

    Interstellar.movePlayer = (id, x, y) => {
      if(Interstellar.players){
        // console.log(Interstellar.players);
        // Interstellar.players[id].x = x;
        // Interstellar.players[id].y = y;
      }
    };

    Client.askNewPlayer();

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
    // createFighter(400, 800, true, 1);
    // createFighter(1400, 300, false, 2);
    createMiniMap();
    createPlanets();
    Interstellar.playerUpdater = setInterval(()=>{
      Client.sendCoord();
    }, 2000);
}

function createPlanets(){
  planets = Interstellar.add.group();

  let planet = Interstellar.add.sprite(800, 800, 'planet-2');
  planet.scale.setTo(4, 4);
  planet.anchor.setTo(.5, .5);
  planet.faction = 0;
  planet.claim = 0;
  planet.orbitCircle = Interstellar.add.graphics(planet.x, planet.y);
  planet.orbitCircle.lineStyle(1, 0xFFFFFF, 0.9);
  planet.orbitCircle.drawEllipse(0, 0, 250, 250);
  planet.orbitCircle.parentObj = planet;
  planet.orbitCircle.claimPercent = 0;
  planet.orbitCircle.claimTimer = null;
  planet.orbitCircle.regenTimer = null;

  Interstellar.physics.arcade.enable(planet);
  planet.body.setCircle(14, 2, 2);

  Interstellar.physics.arcade.enable(planet.orbitCircle);
  planet.orbitCircle.body.setCircle(250, -250, -250);


  claimZones.push(planet.orbitCircle);
  planets.add(planet);
}

function update() {
    // let i = 0;
    fighters.forEachAlive((item)=>{
      if(item.id === Interstellar.playerId){
        let ship = item.getChildAt(0);
        let shield = item.getChildAt(1);
        let health = item.getChildAt(2);
        let shieldBar = item.getChildAt(3);
        Interstellar.physics.arcade.overlap(shield, bullets, shieldBulletHandler, null, this);
        Interstellar.physics.arcade.overlap(ship, resources, resourceHandler, null, this);
        Interstellar.physics.arcade.overlap(asteroids, shield, shieldAsteroidCollision, null, this);
        Interstellar.physics.arcade.overlap(bullets, ship, shipShotHandler, null, this);
        updatePlayer(ship, shield);
        shield.x = ship.x;
        shield.y = ship.y;
        health.x = ship.x;
        health.y = ship.y +62;
        shieldBar.x = ship.x;
        shieldBar.y = ship.y +50;
        // i++;
      }
    });

    fighters.forEachAlive((item)=> {
        if(item.id !== Interstellar.playerId){
          let ship = item.getChildAt(0);
          ship.x = Interstellar.playersX[item.id];
          ship.y = Interstellar.playersY[item.id];
          let shield = item.getChildAt(1);
          let health = item.getChildAt(2);
          let shieldBar = item.getChildAt(3);
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
        }
        // i++;
    });

    Interstellar.physics.arcade.overlap(planets, ships, planetCrashHandler, (obj1, obj2) => {
      if (obj1.disableCollisionsFor.includes(obj2))
        return false;
      else
        return true;
    }, this);
    Interstellar.physics.arcade.overlap(planets, bullets, (planet, bullet) => {
      bullet.kill();
    }, null, this);
    Interstellar.physics.arcade.overlap(claimZones, ships, claimingPlanet, null, this);
    Interstellar.physics.arcade.overlap(shields, shields, shieldtoShieldCollisionHandler, collisionProcessCheck, this);
    Interstellar.physics.arcade.overlap(shields, ships, shieldToShipCollisionHandler, (shield1, ship1) => {
      if(shield1.associatedShipSprite === ship1)
        return false;
      return collisionProcessCheck(shield1, ship1);
    }, this);
    Interstellar.physics.arcade.overlap(ships, ships, shipToShipCollisionHandler, collisionProcessCheck, this);

    asteroids.forEachAlive((item) => {
      item.getChildAt(0).angle += .5;
      Interstellar.physics.arcade.overlap(bullets, item, asteroidCollisionHandler, null, this);
    });
    resources.forEachAlive((item)=>{
      item.angle += -.5;
    });
    updateMiniMap();
}

function collisionProcessCheck(obj1, obj2){
  if (obj1.disableCollisionsFor.includes(obj2) && obj2.disableCollisionsFor.includes(obj1))
    return false;
  else
    return true;
}

function claimingPlanet(claim, ship){
  window.clearInterval(claim.regenTimer);
  window.clearTimeout(claim.claimTimer);
  claim.parentObj.faction = ship.faction;
  if(claim.claimPercent<360)
    claim.claimPercent += 0.2;
  updateArc(claim, 0xe74c3c, true);
  if(claim.claimPercent<360 && claim.claimPercent>0){
    claim.claimTimer = window.setTimeout(() => {
      claim.regenTimer = setInterval(()=>{
        claim.claimPercent -= .1;
        updateArc(claim, 0xe74c3c, true);
        if(claim.claimPercent <= 0){
          claim.claimPercent = 0;
          updateArc(claim, 0xe74c3c, false);
          clearInterval(claim.regenTimer);
        }
      }, 20);
    }, 2000);

  }
}

function updateArc(claimZone, factionColour, hasArc){
  claimZone.clear();
  claimZone.lineStyle(1, 0xFFFFFF, 0.9);
  claimZone.drawEllipse(0, 0, 250, 250);
  if(hasArc){
    claimZone.lineStyle(8, factionColour);
    claimZone.arc(0, 0, 250, Interstellar.math.degToRad(0), Interstellar.math.degToRad(claimZone.claimPercent), false);
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


function render() {
    // if(Interstellar.playerId && Interstellar.players)
    //    Interstellar.debug.spriteInfo(Interstellar.players[Interstellar.playerId], 32, 32);
    // Interstellar.debug.spriteBounds(miniMap);
    // Interstellar.debug.body(planets.getChildAt(0));
    // resources.forEachAlive((item)=>{
    //   Interstellar.debug.body(item);
    // });

}
