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
