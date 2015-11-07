function mapSprites(bufs, texImage, sprites, spriteDefs) {

  var pixels = {x: texImage.width, y: texImage.height};

  sprites.forEach(function(sp, spIndex){
    if (spIndex >= bufs.vertexPositionGlBuffer.numItems/6) {
      console.log('too many sprites.');
      return;
    }
    bufs.vertexPositions[spIndex*12 + 0] = sp.x;
    bufs.vertexPositions[spIndex*12 + 1] = sp.y;
    bufs.vertexPositions[spIndex*12 + 2] = sp.x + sp.w;
    bufs.vertexPositions[spIndex*12 + 3] = sp.y;
    bufs.vertexPositions[spIndex*12 + 4] = sp.x;
    bufs.vertexPositions[spIndex*12 + 5] = sp.y + sp.h;
    bufs.vertexPositions[spIndex*12 + 6] = sp.x;
    bufs.vertexPositions[spIndex*12 + 7] = sp.y + sp.h;
    bufs.vertexPositions[spIndex*12 + 8] = sp.x + sp.w;
    bufs.vertexPositions[spIndex*12 + 9] = sp.y;
    bufs.vertexPositions[spIndex*12 + 10] = sp.x + sp.w;
    bufs.vertexPositions[spIndex*12 + 11] = sp.y + sp.h;

    var def = spriteDefs[sp.name];
    var defTrf = {
      x: def.x / pixels.x,
      y: def.y / pixels.y,
      w: def.w / pixels.x,
      h: def.h / pixels.x,
    };

    bufs.textureCoords[spIndex*12 + 0] = defTrf.x;
    bufs.textureCoords[spIndex*12 + 1] = defTrf.y;
    bufs.textureCoords[spIndex*12 + 2] = defTrf.x + defTrf.w;
    bufs.textureCoords[spIndex*12 + 3] = defTrf.y;
    bufs.textureCoords[spIndex*12 + 4] = defTrf.x;
    bufs.textureCoords[spIndex*12 + 5] = defTrf.y + defTrf.h;
    bufs.textureCoords[spIndex*12 + 6] = defTrf.x;
    bufs.textureCoords[spIndex*12 + 7] = defTrf.y + defTrf.h;
    bufs.textureCoords[spIndex*12 + 8] = defTrf.x + defTrf.w;
    bufs.textureCoords[spIndex*12 + 9] = defTrf.y;
    bufs.textureCoords[spIndex*12 + 10] = defTrf.x + defTrf.w;
    bufs.textureCoords[spIndex*12 + 11] = defTrf.x + defTrf.h;
  });
}
