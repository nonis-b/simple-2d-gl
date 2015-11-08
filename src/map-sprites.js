function mapSprites(bufs, canvasSize, texImage, sprites, spriteDefs) {

  var srcSize = {x: texImage.width, y: texImage.height};

  sprites.forEach(function(sp, spIndex){
    if (spIndex >= bufs.vertexPositionGlBuffer.numItems/6) {
      console.log('too many sprites.');
      return;
    }
    bufs.vertexPositions[spIndex*12 + 0] = sp.x / canvasSize.x;
    bufs.vertexPositions[spIndex*12 + 1] = -sp.y / canvasSize.y;
    bufs.vertexPositions[spIndex*12 + 2] = (sp.x + sp.w)  / canvasSize.x;
    bufs.vertexPositions[spIndex*12 + 3] = -sp.y / canvasSize.y;
    bufs.vertexPositions[spIndex*12 + 4] = sp.x  / canvasSize.x;
    bufs.vertexPositions[spIndex*12 + 5] = -(sp.y + sp.h) / canvasSize.y;
    bufs.vertexPositions[spIndex*12 + 6] = sp.x  / canvasSize.x;
    bufs.vertexPositions[spIndex*12 + 7] = -(sp.y + sp.h) / canvasSize.y;
    bufs.vertexPositions[spIndex*12 + 8] = (sp.x + sp.w) / canvasSize.x;
    bufs.vertexPositions[spIndex*12 + 9] = -sp.y / canvasSize.y;
    bufs.vertexPositions[spIndex*12 + 10] = (sp.x + sp.w)  / canvasSize.x;
    bufs.vertexPositions[spIndex*12 + 11] = -(sp.y + sp.h) / canvasSize.y;

    var def = spriteDefs[sp.name];
    var defTrf = {
      x: def.x / srcSize.x,
      y: def.y / srcSize.y,
      w: def.w / srcSize.x,
      h: def.h / srcSize.x,
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
