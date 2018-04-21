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
const UpdateScale = MiniMapWidth/gameWidth;
const ShipColor = 0xffffff;

// Create Groups
let asteroids, resources;
let shields = [], ships = [], gameObjects = [];

// Minimap
let miniMapContainer, resolution, renderTexture, miniMap, minimapContents;

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
    createMiniMap();
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



function updatePlayer(playerShip, playerShield){
  playerShip.rotation = Interstellar.physics.arcade.angleToPointer(playerShip);
  movementWASDNonAngularVelocity(playerShip);
  if (fireButton.isDown)
  {
      fireBullet(playerShip, playerShield);
  }
}


function render() {
    Interstellar.debug.spriteInfo(fighters.getChildAt(0).getChildAt(0), 32, 32);
    // Interstellar.debug.spriteBounds(miniMap);
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

function createMiniMap() {

  miniMapContainer = Interstellar.add.group();
  resolution = .1;
  if (Interstellar.world.width > 8000) {
    var renderWH = 8000;
  } else {
    var renderWH = Interstellar.world.width;
  }

  renderTexture = Interstellar.add.renderTexture(renderWH, renderWH);
  renderTexture.resolution = resolution;

  var miniMapY = Interstellar.camera.view.height - (MiniMapHeight + MiniMapPaddingBottom);
  var miniMapX = Interstellar.camera.view.width - (MiniMapWidth + MiniMapPaddingRight);
  renderTexture.trueWidth = renderTexture.resolution * Interstellar.world.width;
  renderTexture.trueHeight = renderTexture.resolution * Interstellar.world.height;

  // var miniWidth = miniMapX - (.075 * renderTexture.trueWidth);
  // var miniHeight = miniMapY - (.06 * renderTexture.trueHeight);
  console.log(miniMapX + " " + miniMapY);
  miniMap = Interstellar.add.sprite(miniMapX, miniMapY, renderTexture);
  // var padding = .241 * renderTexture.trueHeight;
  miniMap.fixedToCamera = true;

  // The border used to contain the minimap
  var miniMapUI = Interstellar.add.graphics(miniMapX, miniMapY);
  // miniMapUI.width = (renderTexture.trueWidth + padding);
  // miniMapUI.height = (renderTexture.trueHeight + padding);
  miniMapUI.lineStyle(MiniMapLineThickness, 0xFFFFFF, 0.9);
  miniMapUI.drawRoundedRect(0, 0, MiniMapWidth, MiniMapHeight, 4);
  miniMapUI.fixedToCamera = true;

  // Minimap contents
  minimapContents = Interstellar.add.graphics(miniMap.x+1, miniMap.y+1);
  minimapContents.fixedToCamera = true;

  // Background to the minimap
  var bg = Interstellar.add.graphics(miniMap.x+1, miniMap.y+1);
  bg.beginFill(0x000033, 1);
  let bgWidth = 150, bgHeight = 150;
  bg.drawRect(0, 0, MiniMapWidth, MiniMapHeight);
  bg.fixedToCamera = true;

  var children = [bg, miniMap, minimapContents, miniMapUI]; // Place the elements in a certain viewing order
  miniMapContainer.addMultiple(children);
}

function updateMiniMap(){
  minimapContents.clear();
  ships.forEach((item) => {
    var unitMiniX = item.x * UpdateScale;
    var unitMiniY = item.y * UpdateScale;
    minimapContents.beginFill(ShipColor);
    minimapContents.drawEllipse(unitMiniX, unitMiniY, 1.5, 1.5);
  });
}
