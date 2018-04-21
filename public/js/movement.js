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
