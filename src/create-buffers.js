function generateRects(num) {
  var buf = [];
  for (var i = 0; i < num; i++) {
    buf = buf.concat([
      -1.0, -1.0,
      1.0, -1.0,
      -1.0,  1.0,
      -1.0,  1.0,
      1.0, -1.0,
      1.0,  1.0]);
  };
  return buf;
}

function generateTexCoords(num) {
  var buf = [];
  for (var i = 0; i < num; i++) {
    buf = buf.concat([
      0.0,  0.0,
      1.0,  0.0,
      0.0,  1.0,
      0.0,  1.0,
      1.0,  0.0,
      1.0,  1.0]);
  };
  return buf;
}

function initBuffers(gl, maxNum) {
  var vertexPositionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
  var vertexPositions = new Float32Array(generateRects(maxNum));
  gl.bufferData(gl.ARRAY_BUFFER, vertexPositions, gl.DYNAMIC_DRAW);
  vertexPositionBuffer.itemSize = 2;
  vertexPositionBuffer.numItems = maxNum*6;
  var vertexTextureCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexTextureCoordBuffer);
  var textureCoords = new Float32Array(generateTexCoords(maxNum));
  gl.bufferData(gl.ARRAY_BUFFER, textureCoords, gl.DYNAMIC_DRAW);
  vertexTextureCoordBuffer.itemSize = 2;
  vertexTextureCoordBuffer.numItems = maxNum*6;
  return {
    vertexPositions: vertexPositions,
    textureCoords: textureCoords,
    vertexPositionGlBuffer: vertexPositionBuffer,
    textureCoordsGlBuffer: vertexTextureCoordBuffer
  }
}
