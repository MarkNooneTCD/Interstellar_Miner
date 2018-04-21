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
  // console.log(miniMapX + " " + miniMapY);
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
    var unitMiniX = item.x * UpdateScaleWidth;
    var unitMiniY = item.y * UpdateScaleHeight;
    minimapContents.beginFill(ShipColor);
    minimapContents.drawEllipse(unitMiniX, unitMiniY, 1.5, 1.5);
  });
  asteroids.forEachAlive((item) => {
    var unitMiniX = item.x * UpdateScaleWidth;
    var unitMiniY = item.y * UpdateScaleHeight;
    minimapContents.beginFill(ShipColor);
    minimapContents.drawEllipse(unitMiniX, unitMiniY, 2, 2);
  });
  planets.forEachAlive((item) => {
    var unitMiniX = item.x * UpdateScaleWidth;
    var unitMiniY = item.y * UpdateScaleHeight;
    minimapContents.beginFill(ShipColor);
    minimapContents.drawEllipse(unitMiniX, unitMiniY, 3, 3);
    minimapContents.endFill();
    minimapContents.lineStyle(1, 0xFFFFFF, 0.9);
    minimapContents.drawEllipse(item.x* UpdateScaleWidth, item.y* UpdateScaleHeight, 250*UpdateScaleWidth, 250*UpdateScaleHeight);
  });
}
