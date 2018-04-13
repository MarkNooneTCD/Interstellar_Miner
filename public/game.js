const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};
const InterstellarMiner =  new Phaser.Game(config);


function preload(){
  this.load.image('logo', 'assets/images/logo.png');
  this.load.image('preloadbar', 'assets/images/preloader-bar.png');
}

function create(){
  //loading screen will have a white background
  InterstellarMiner.stage.backgroundColor = '#fff';

  //scaling options
  // this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  // this.scale.minWidth = 240;
  // this.scale.minHeight = 170;
  // this.scale.maxWidth = 2880;
  // this.scale.maxHeight = 1920;

  this.add.image(400, 300, 'preloadbar');

  // //have the game centered horizontally
  // this.scale.pageAlignHorizontally = true;
  //
  // //screen size will be set automatically
  // this.scale.setScreenSize(true);
  //
  // //physics system for movement
  // this.game.physics.startSystem(Phaser.Physics.ARCADE);
}

function update(){

}
