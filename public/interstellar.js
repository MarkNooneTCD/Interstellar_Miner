const mvmtSpeed = 5;
const fireRate = 100;
const gameWidth = window.innerWidth;
const gameHeight = window.innerHeight;
let sprite;
let nextFire = 0;
let fireButton;
let spaceBackground;

var Interstellar = new Phaser.Game(gameWidth, gameHeight, Phaser.AUTO, '', {
  preload: preload,
  create: create,
  update: update,
  render: render
});

function preload() {
    Interstellar.load.image('fighter', 'assets/sprites/fighter.png');
    Interstellar.load.image('bullet', 'assets/images/bullet.png');
    Interstellar.load.image('space', 'assets/images/space.jpg');
}

function create() {

    Interstellar.physics.startSystem(Phaser.Physics.ARCADE);

    this.spaceBackground = Interstellar.add.tileSprite(0, 0, Interstellar.width, Interstellar.height, 'space');

    sprite = Interstellar.add.sprite(400, 300, 'fighter');
    sprite.anchor.setTo(0.5, 0.5);
    sprite.scale.setTo(.4, .4);

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

    // Space to Fire
    // fireButton = Interstellar.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    fireButton = Interstellar.input.activePointer.leftButton;
    //  Enable Arcade Physics for the sprite
    Interstellar.physics.enable(sprite, Phaser.Physics.ARCADE);

    //  Tell it we don't want physics to manage the rotation
    sprite.body.allowRotation = false;

}

function update() {
    sprite.rotation = Interstellar.physics.arcade.angleToPointer(sprite);
    movementArrow(sprite);
    movementWASD(sprite);
    if (fireButton.isDown)
    {
        fireBullet();
    }
}

function render() {
    Interstellar.debug.spriteInfo(sprite, 32, 32);
}

function movementArrow(){
  if (Interstellar.input.keyboard.isDown(Phaser.Keyboard.LEFT))
  {
      sprite.x -= mvmtSpeed;
  }
  else if (Interstellar.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
  {
      sprite.x += mvmtSpeed;
  }

  if (Interstellar.input.keyboard.isDown(Phaser.Keyboard.UP))
  {
      sprite.y -= mvmtSpeed;
  }
  else if (Interstellar.input.keyboard.isDown(Phaser.Keyboard.DOWN))
  {
      sprite.y += mvmtSpeed;
  }
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
        var x = sprite.x+2.5 + (Math.cos(sprite.rotation) * length);
        var y = sprite.y + (Math.sin(sprite.rotation) * length);

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
      sprite.x -= mvmtSpeed;
  }
  else if (Interstellar.input.keyboard.isDown(Phaser.Keyboard.D))
  {
      sprite.x += mvmtSpeed;
  }

  if (Interstellar.input.keyboard.isDown(Phaser.Keyboard.W))
  {
      sprite.y -= mvmtSpeed;
  }
  else if (Interstellar.input.keyboard.isDown(Phaser.Keyboard.S))
  {
      sprite.y += mvmtSpeed;
  }
}
