window.requestAnimFrame = (function() {
  return window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function(callback, element) {
          window.setTimeout(callback, 1000/60);
      };
})();

function Simple2dGl(canvasElement, fragShaderEl, vertShaderEl, texturePath, subImagesMap, updateFunc, shaderProgramInitedCallback) {

  function drawScene(gl, shaderProgram, bufs, texture, sprites) {
    mapSprites(bufs, canvasSize, texture.image, sprites, subImagesMap);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enableVertexAttribArray(bufs.vertexPositionGlBuffer);
    gl.bindBuffer(gl.ARRAY_BUFFER, bufs.vertexPositionGlBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, bufs.vertexPositions);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, bufs.vertexPositionGlBuffer.itemSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, bufs.textureCoordsGlBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, bufs.textureCoords);
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, bufs.textureCoordsGlBuffer.itemSize, gl.FLOAT, false, 0, 0);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.drawArrays(gl.TRIANGLES, 0, sprites.length*6);
  }

  var sprites = [];

  function tick(gl, shaderProgram, bufs, texture, updateFunc, lastTime) {
    var timeNow = new Date().getTime();
    if (lastTime == 0) lastTime = timeNow - 1/60;
    var delta = timeNow - lastTime;
    requestAnimFrame(function() {tick(gl, shaderProgram, bufs, texture, updateFunc, timeNow) });
    drawScene(gl, shaderProgram, bufs, texture, sprites);
    sprites = updateFunc(gl, shaderProgram, delta, timeNow);
  }

  var canvas = document.getElementById(canvasElement);
  var canvasSize = {x: canvas.width, y: canvas.height};
  var gl = initGL(canvas);
  var shaderProgram = initShaders(gl, fragShaderEl, vertShaderEl);
  shaderProgramInitedCallback(gl, shaderProgram);
  var bufs = initBuffers(gl, 100);
  var texture = initTexture(gl, texturePath);
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  gl.enable(gl.BLEND);
  gl.disable(gl.DEPTH_TEST);

  tick(gl, shaderProgram, bufs, texture, updateFunc, 0);
}
