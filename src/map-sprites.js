function mapSprites(bufs, canvasSize, texImage, sprites, spriteDefs) {

  var srcSize = {x: texImage.width, y: texImage.height};

  function rotateX(px, py, ox, oy, angle) {
    return Math.cos(angle) * (px-ox) - Math.sin(angle) * (py-oy) + ox;
  }

  function rotateY(px, py, ox, oy, angle) {
    return Math.sin(angle) * (px-ox) + Math.cos(angle) * (py-oy) + oy;
  }

  function scale(p, o, scale) {
    return (p-o) * scale + o;
  }


  sprites.forEach(function(sp, spIndex){
    if (spIndex >= bufs.vertexPositionGlBuffer.numItems/6) {
      console.log('too many sprites.');
      return;
    }

    var cx = sp.cx !== undefined ? sp.x + sp.cx : sp.x + sp.w/2;
    var cy = sp.cy !== undefined ? sp.y + sp.cy : sp.y + sp.h/2;
    var rot = sp.rot !== undefined ? sp.rot : 0.0;
    var sc = sp.scale !== undefined ? sp.scale : 1.0;
    var spTrf = {
      tlx: scale(rotateX(sp.x, sp.y, cx, cy, rot), cx, sc),
      tly: scale(rotateY(sp.x, sp.y, cx, cy, rot), cy, sc),
      trx: scale(rotateX(sp.x + sp.w, sp.y, cx, cy, rot), cx, sc),
      try: scale(rotateY(sp.x + sp.w, sp.y, cx, cy, rot), cy, sc),
      blx: scale(rotateX(sp.x, sp.y + sp.h, cx, cy, rot), cx, sc),
      bly: scale(rotateY(sp.x, sp.y + sp.h, cx, cy, rot), cy, sc),
      brx: scale(rotateX(sp.x + sp.w, sp.y + sp.h, cx, cy, rot), cx, sc),
      bry: scale(rotateY(sp.x + sp.w, sp.y + sp.h, cx, cy, rot), cy, sc)
    }

    bufs.vertexPositions[spIndex*12 + 0] = (spTrf.tlx / canvasSize.x)*2-1;
    bufs.vertexPositions[spIndex*12 + 1] = (1.0-(spTrf.tly / canvasSize.y))*2-1;
    bufs.vertexPositions[spIndex*12 + 2] = (spTrf.trx / canvasSize.x)*2-1;
    bufs.vertexPositions[spIndex*12 + 3] = (1.0-(spTrf.try / canvasSize.y))*2-1;
    bufs.vertexPositions[spIndex*12 + 4] = (spTrf.blx / canvasSize.x)*2-1;
    bufs.vertexPositions[spIndex*12 + 5] = (1.0-(spTrf.bly / canvasSize.y))*2-1;
    bufs.vertexPositions[spIndex*12 + 6] = (spTrf.blx  / canvasSize.x)*2-1;
    bufs.vertexPositions[spIndex*12 + 7] = (1.0-((spTrf.bly) / canvasSize.y))*2-1;
    bufs.vertexPositions[spIndex*12 + 8] = ((spTrf.trx) / canvasSize.x)*2-1;
    bufs.vertexPositions[spIndex*12 + 9] = (1.0-(spTrf.try / canvasSize.y))*2-1;
    bufs.vertexPositions[spIndex*12 + 10] = ((spTrf.brx)  / canvasSize.x)*2-1;
    bufs.vertexPositions[spIndex*12 + 11] = (1.0-((spTrf.bry) / canvasSize.y))*2-1;

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
