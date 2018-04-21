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
