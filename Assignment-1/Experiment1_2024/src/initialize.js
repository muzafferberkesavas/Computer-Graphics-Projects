function loadShader(gl, type, source) {

  const shader = gl.createShader(type);

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("Unable to load shader: " + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;

}

function initShaderProgram(gl, vsSource, fsSource) {

  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);

  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  if (!vertexShader || !fragmentShader) {
    return null;
  }

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    console.error("Unable to initialize the shader program: " + gl.getProgramInfoLog(shaderProgram));
    return null;
  }

  return shaderProgram;

}


function initBuffer(gl, positions, arrayType){                          // Initialize the buffer with respect to arrayType

  const buffer = gl.createBuffer();


  if (arrayType === Float32Array){

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    return {
      position : buffer
    };
  } else if (arrayType === Uint16Array){

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);

    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(triangulation(positions)), gl.STATIC_DRAW);

    return {
      position: buffer
    };
  }
}