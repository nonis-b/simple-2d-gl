function mapSprites(bufs, canvasSize, texImage, sprites, spriteDefs) {

  var srcSize = {x: texImage.width, y: texImage.height};

  sprites.forEach(function(sp, spIndex){
    if (spIndex >= bufs.vertexPositionGlBuffer.numItems/6) {
      console.log('too many sprites.');
      return;
    }
    bufs.vertexPositions[spIndex*12 + 0] = (sp.x / canvasSize.x)*2-1;
    bufs.vertexPositions[spIndex*12 + 1] = (1.0-(sp.y / canvasSize.y))*2-1;
    bufs.vertexPositions[spIndex*12 + 2] = ((sp.x + sp.w)  / canvasSize.x)*2-1;
    bufs.vertexPositions[spIndex*12 + 3] = (1.0-(sp.y / canvasSize.y))*2-1;
    bufs.vertexPositions[spIndex*12 + 4] = (sp.x  / canvasSize.x)*2-1;
    bufs.vertexPositions[spIndex*12 + 5] = (1.0-((sp.y + sp.h) / canvasSize.y))*2-1;
    bufs.vertexPositions[spIndex*12 + 6] = (sp.x  / canvasSize.x)*2-1;
    bufs.vertexPositions[spIndex*12 + 7] = (1.0-((sp.y + sp.h) / canvasSize.y))*2-1;
    bufs.vertexPositions[spIndex*12 + 8] = ((sp.x + sp.w) / canvasSize.x)*2-1;
    bufs.vertexPositions[spIndex*12 + 9] = (1.0-(sp.y / canvasSize.y))*2-1;
    bufs.vertexPositions[spIndex*12 + 10] = ((sp.x + sp.w)  / canvasSize.x)*2-1;
    bufs.vertexPositions[spIndex*12 + 11] = (1.0-((sp.y + sp.h) / canvasSize.y))*2-1;

    var def = spriteDefs[sp.name];
    var defTrf = {
      x: def.x / srcSize.x,
      y: def.y / srcSize.y,
      w: def.w / srcSize.x,
      h: def.h / srcSize.y,
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
    bufs.textureCoords[spIndex*12 + 11] = defTrf.y + defTrf.h;
  });
}
