function initGL(canvas) {
  try {
    var gl = canvas.getContext("webgl");
    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;
    return gl;
  } catch (e) {
  }
  if (!gl) {
    alert("Could not initialise WebGL");
  }

}
