function resourceHandler(fighter, resource) {
  resource.kill();
}

function asteroidCollisionHandler (asteroid, bullet) {
    bullet.kill(); // Destroy The bullet on hit
    damageAsteroid(asteroid, 0.1);
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

function shieldtoShieldCollisionHandler(shield1, shield2){
  damageShield(shield1, .2);
  damageShield(shield2, .2);
  let ship1 = shield1.associatedShipSprite;
  let ship2 = shield2.associatedShipSprite;
  ship1.xSpeed = -ship1.xSpeed;
  ship1.ySpeed = -ship1.ySpeed;
  ship2.xSpeed = -ship2.xSpeed;
  ship2.ySpeed = -ship2.ySpeed;
  // console.log("Shield => Shield");
  shield1.disableCollisionsFor.push(shield2);
  shield2.disableCollisionsFor.push(shield1);
  setTimeout(() => {
    let index = shield1.disableCollisionsFor.indexOf(shield2);
    if (index > -1) {
      shield1.disableCollisionsFor.splice(index, 1);
    }
    index = shield2.disableCollisionsFor.indexOf(shield1);
    if (index > -1) {
      shield2.disableCollisionsFor.splice(index, 1);
    }
  }, 100);
}

function shieldToShipCollisionHandler(shield1, ship1){
  damageShield(shield1, .1);
  damageShip(ship1, .2)
  let ship2 = shield1.associatedShipSprite;
  ship1.xSpeed = -ship1.xSpeed;
  ship1.ySpeed = -ship1.ySpeed;
  ship2.xSpeed = -ship2.xSpeed;
  ship2.ySpeed = -ship2.ySpeed;
  shield1.disableCollisionsFor.push(ship1);
  ship1.disableCollisionsFor.push(shield1);
  setTimeout(() => {
    let index = shield1.disableCollisionsFor.indexOf(ship1);
    if (index > -1) {
      shield1.disableCollisionsFor.splice(index, 1);
    }
    index = ship1.disableCollisionsFor.indexOf(shield1);
    if (index > -1) {
      ship1.disableCollisionsFor.splice(index, 1);
    }
  }, 100);
  // console.log("Shield => Ship");
}

function shipToShipCollisionHandler(ship1, ship2){
  damageShip(ship1, .3);
  damageShip(ship2, .3);
  ship1.xSpeed = -ship1.xSpeed;
  ship1.ySpeed = -ship1.ySpeed;
  ship2.xSpeed = -ship2.xSpeed;
  ship2.ySpeed = -ship2.ySpeed;
  console.log("Shield => Shield");
  ship2.disableCollisionsFor.push(ship1);
  setTimeout(() => {
    let index = ship1.disableCollisionsFor.indexOf(ship2);
    if (index > -1) {
      ship1.disableCollisionsFor.splice(index, 1);
    }
    index = ship2.disableCollisionsFor.indexOf(ship1);
    if (index > -1) {
      ship2.disableCollisionsFor.splice(index, 1);
    }
  }, 100);
  console.log("Ship => Ship");
}

function planetCrashHandler(ship, planet){
  damageShip(ship, .4);
  ship.xSpeed = -ship.xSpeed;
  ship.ySpeed = -ship.ySpeed;
  ship.disableCollisionsFor.push(planet);
  setTimeout(() => {
    let index = ship.disableCollisionsFor.indexOf(planet);
    if (index > -1) {
      ship.disableCollisionsFor.splice(index, 1);
    }
  }, 100);
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
