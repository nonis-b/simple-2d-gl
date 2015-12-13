window.requestAnimFrame = function() {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback, element) {
        window.setTimeout(callback, 1e3 / 60);
    };
}();

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
        gl.drawArrays(gl.TRIANGLES, 0, sprites.length * 6);
    }
    var sprites = [];
    function tick(gl, shaderProgram, bufs, texture, updateFunc, lastTime) {
        var timeNow = new Date().getTime();
        if (lastTime == 0) lastTime = timeNow - 1 / 60;
        var delta = timeNow - lastTime;
        requestAnimFrame(function() {
            tick(gl, shaderProgram, bufs, texture, updateFunc, timeNow);
        });
        drawScene(gl, shaderProgram, bufs, texture, sprites);
        sprites = updateFunc(gl, shaderProgram, delta, timeNow);
    }
    var canvas = document.getElementById(canvasElement);
    var canvasSize = {
        x: canvas.width,
        y: canvas.height
    };
    var gl = initGL(canvas);
    var shaderProgram = initShaders(gl, fragShaderEl, vertShaderEl);
    shaderProgramInitedCallback(gl, shaderProgram);
    var bufs = initBuffers(gl, 500);
    var texture = initTexture(gl, texturePath);
    gl.clearColor(0, 0, 0, 1);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable(gl.BLEND);
    gl.disable(gl.DEPTH_TEST);
    tick(gl, shaderProgram, bufs, texture, updateFunc, 0);
}

function generateRects(num) {
    var buf = [];
    for (var i = 0; i < num; i++) {
        buf = buf.concat([ -1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1 ]);
    }
    return buf;
}

function generateTexCoords(num) {
    var buf = [];
    for (var i = 0; i < num; i++) {
        buf = buf.concat([ 0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1 ]);
    }
    return buf;
}

function initBuffers(gl, maxNum) {
    var vertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
    var vertexPositions = new Float32Array(generateRects(maxNum));
    gl.bufferData(gl.ARRAY_BUFFER, vertexPositions, gl.DYNAMIC_DRAW);
    vertexPositionBuffer.itemSize = 2;
    vertexPositionBuffer.numItems = maxNum * 6;
    var vertexTextureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexTextureCoordBuffer);
    var textureCoords = new Float32Array(generateTexCoords(maxNum));
    gl.bufferData(gl.ARRAY_BUFFER, textureCoords, gl.DYNAMIC_DRAW);
    vertexTextureCoordBuffer.itemSize = 2;
    vertexTextureCoordBuffer.numItems = maxNum * 6;
    return {
        vertexPositions: vertexPositions,
        textureCoords: textureCoords,
        vertexPositionGlBuffer: vertexPositionBuffer,
        textureCoordsGlBuffer: vertexTextureCoordBuffer
    };
}

function initGL(canvas) {
    try {
        var gl = canvas.getContext("webgl");
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
        return gl;
    } catch (e) {}
    if (!gl) {
        alert("Could not initialise WebGL");
    }
}

function getShader(gl, id) {
    var shaderScript = document.getElementById(id);
    if (!shaderScript) {
        return null;
    }
    var str = "";
    var k = shaderScript.firstChild;
    while (k) {
        if (k.nodeType == 3) {
            str += k.textContent;
        }
        k = k.nextSibling;
    }
    var shader;
    if (shaderScript.type == "x-shader/x-fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type == "x-shader/x-vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        return null;
    }
    gl.shaderSource(shader, str);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }
    return shader;
}

function initShaders(gl, fragShaderEl, vertShaderEl) {
    var fragmentShader = getShader(gl, fragShaderEl);
    var vertexShader = getShader(gl, vertShaderEl);
    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }
    gl.useProgram(shaderProgram);
    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
    shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
    gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);
    shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");
    return shaderProgram;
}

function initTexture(gl, texturePath) {
    texture = gl.createTexture();
    texture.image = new Image();
    texture.image.onload = function() {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.bindTexture(gl.TEXTURE_2D, null);
    };
    texture.image.src = texturePath;
    return texture;
}

function mapSprites(bufs, canvasSize, texImage, sprites, spriteDefs) {
    var srcSize = {
        x: texImage.width,
        y: texImage.height
    };
    sprites.forEach(function(sp, spIndex) {
        if (spIndex >= bufs.vertexPositionGlBuffer.numItems / 6) {
            console.log("too many sprites.");
            return;
        }
        bufs.vertexPositions[spIndex * 12 + 0] = sp.x / canvasSize.x * 2 - 1;
        bufs.vertexPositions[spIndex * 12 + 1] = (1 - sp.y / canvasSize.y) * 2 - 1;
        bufs.vertexPositions[spIndex * 12 + 2] = (sp.x + sp.w) / canvasSize.x * 2 - 1;
        bufs.vertexPositions[spIndex * 12 + 3] = (1 - sp.y / canvasSize.y) * 2 - 1;
        bufs.vertexPositions[spIndex * 12 + 4] = sp.x / canvasSize.x * 2 - 1;
        bufs.vertexPositions[spIndex * 12 + 5] = (1 - (sp.y + sp.h) / canvasSize.y) * 2 - 1;
        bufs.vertexPositions[spIndex * 12 + 6] = sp.x / canvasSize.x * 2 - 1;
        bufs.vertexPositions[spIndex * 12 + 7] = (1 - (sp.y + sp.h) / canvasSize.y) * 2 - 1;
        bufs.vertexPositions[spIndex * 12 + 8] = (sp.x + sp.w) / canvasSize.x * 2 - 1;
        bufs.vertexPositions[spIndex * 12 + 9] = (1 - sp.y / canvasSize.y) * 2 - 1;
        bufs.vertexPositions[spIndex * 12 + 10] = (sp.x + sp.w) / canvasSize.x * 2 - 1;
        bufs.vertexPositions[spIndex * 12 + 11] = (1 - (sp.y + sp.h) / canvasSize.y) * 2 - 1;
        var def = spriteDefs[sp.name];
        var defTrf = {
            x: def.x / srcSize.x,
            y: def.y / srcSize.y,
            w: def.w / srcSize.x,
            h: def.h / srcSize.y
        };
        bufs.textureCoords[spIndex * 12 + 0] = defTrf.x;
        bufs.textureCoords[spIndex * 12 + 1] = defTrf.y;
        bufs.textureCoords[spIndex * 12 + 2] = defTrf.x + defTrf.w;
        bufs.textureCoords[spIndex * 12 + 3] = defTrf.y;
        bufs.textureCoords[spIndex * 12 + 4] = defTrf.x;
        bufs.textureCoords[spIndex * 12 + 5] = defTrf.y + defTrf.h;
        bufs.textureCoords[spIndex * 12 + 6] = defTrf.x;
        bufs.textureCoords[spIndex * 12 + 7] = defTrf.y + defTrf.h;
        bufs.textureCoords[spIndex * 12 + 8] = defTrf.x + defTrf.w;
        bufs.textureCoords[spIndex * 12 + 9] = defTrf.y;
        bufs.textureCoords[spIndex * 12 + 10] = defTrf.x + defTrf.w;
        bufs.textureCoords[spIndex * 12 + 11] = defTrf.y + defTrf.h;
    });
}
