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
    if (!def) {
      console.log('Sprite ' + sp.name + ' not found!');
      return;
    }
    var defTrf = {
      x1: def.x / srcSize.x,
      y1: def.y / srcSize.y,
      x2: (def.x + def.w) / srcSize.x,
      y2: (def.y + def.h) / srcSize.y,
    };

    if (sp.flipX) {
      var tmp = defTrf.x1;
      defTrf.x1 = defTrf.x2;
      defTrf.x2 = tmp;
    }

    bufs.textureCoords[spIndex*12 + 0] = defTrf.x1;
    bufs.textureCoords[spIndex*12 + 1] = defTrf.y1;
    bufs.textureCoords[spIndex*12 + 2] = defTrf.x2;
    bufs.textureCoords[spIndex*12 + 3] = defTrf.y1;
    bufs.textureCoords[spIndex*12 + 4] = defTrf.x1;
    bufs.textureCoords[spIndex*12 + 5] = defTrf.y2;
    bufs.textureCoords[spIndex*12 + 6] = defTrf.x1;
    bufs.textureCoords[spIndex*12 + 7] = defTrf.y2;
    bufs.textureCoords[spIndex*12 + 8] = defTrf.x2
    bufs.textureCoords[spIndex*12 + 9] = defTrf.y1;
    bufs.textureCoords[spIndex*12 + 10] = defTrf.x2
    bufs.textureCoords[spIndex*12 + 11] = defTrf.y2;
  });
}
