
var Interstellar = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, '', {
  preload: preload,
  create: create,
  update: update,
  render: render
});

function preload() {
    Interstellar.load.image('arrow', 'assets/arrow.png');
}

var sprite;

function create() {

    Interstellar.physics.startSystem(Phaser.Physics.ARCADE);

    Interstellar.stage.backgroundColor = '#0072bc';

    sprite = Interstellar.add.sprite(400, 300, 'arrow');
    sprite.anchor.setTo(0.5, 0.5);

    //  Enable Arcade Physics for the sprite
    Interstellar.physics.enable(sprite, Phaser.Physics.ARCADE);

    //  Tell it we don't want physics to manage the rotation
    sprite.body.allowRotation = false;

}

function update() {
    sprite.rotation = Interstellar.physics.arcade.moveToPointer(sprite, 60, Interstellar.input.activePointer, 500);
}

function render() {
    Interstellar.debug.spriteInfo(sprite, 32, 32);
}
