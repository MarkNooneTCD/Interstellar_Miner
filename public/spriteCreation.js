function createFighter(shipX, shipY, isPlayer){
  let fighter = Interstellar.add.group();

  // Create the fighter ship
  let tmpFighter = Interstellar.add.sprite(shipX, shipY, 'fighter');
  tmpFighter.anchor.setTo(0.5, 0.5);
  tmpFighter.scale.setTo(.4, .4);
  tmpFighter.xSpeed=0;
  tmpFighter.ySpeed=0;
  tmpFighter.disableCollisionsFor = [];

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
  tmpShield.disableCollisionsFor = [];
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

  // Add to physics groups
  shields.push(tmpShield);
  ships.push(tmpFighter);

  // Create a single fighter object
  fighter.add(tmpFighter);
  fighter.add(tmpShield);
  fighter.add(tmpHealthBar);
  fighter.add(tmpShieldBar);

  // Push to all fighter objects
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
