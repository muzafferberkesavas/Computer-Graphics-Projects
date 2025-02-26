"use strict";

const vertexShaderSource = `#version 300 es
in vec2 aPosition;
uniform mat3 uRotation;
void main() {
    vec3 rotatedPosition = uRotation * vec3(aPosition, 1.0);
    gl_Position = vec4(rotatedPosition.xy, 0.0, 1.0);
}`;


const fragmentShaderSource = `#version 300 es
precision mediump float;
uniform vec4 uColor;
out vec4 fragColor;
void main() {
    fragColor = uColor; 
}`;


main();

function main() {

  let angle = 0;
  let rotationSpeed = 0;
  let rotationEnabler = false;
  let colorEnabler = false;
  let colorInterval;
  let currentColor = [1.0,0.0,0.0,1.0];

  const canvas = document.querySelector('#glCanvas');

  const displayWidth = window.innerWidth;
  const displayHeight = window.innerHeight;

  if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
    canvas.width = displayWidth;
    canvas.height = displayHeight;
  }

  const gl = canvas.getContext('webgl2');
  const program = initShaderProgram(gl, vertexShaderSource, fragmentShaderSource);
  gl.useProgram(program);

  const rotationLocation = gl.getUniformLocation(program, "uRotation");
  const centerX = displayWidth / 2;
  const centerY = displayHeight / 2;
  const maxDistance = Math.hypot(centerX, centerY);

  canvas.addEventListener("mousemove", (event) => {
    if (rotationEnabler) {
      const dx = event.clientX - centerX;
      const dy = event.clientY - centerY;
      const distance = Math.hypot(dx, dy);

      rotationSpeed = (distance / maxDistance) * 0.05 * (event.clientX > centerX ? 1 : -1);

    }
  });

  window.addEventListener("keydown", (event) => {

    if (event.key === 'r'){
      stop();
      angle = 0;
      rotationSpeed = 0;
      rotationEnabler = false;
      currentColor = [1.0,0.0,0.0,1.0];
    }else if (event.key === 'm'){
        rotationEnabler = !rotationEnabler;
    } else if (event.key === 'c'){
      colorEnabler = !colorEnabler;
      if (colorEnabler) {
          start()
      }else {
        stop();
      }
    }
  });

  function start(){
    colorInterval = setInterval(() => {
      currentColor = [Math.random(), Math.random(), Math.random(), 1.0];
    }, 500);
  }

  function stop(){
      clearInterval(colorInterval);
  }

  function update() {
    if (rotationEnabler) {
      angle += rotationSpeed;
    }
    draw(gl,program,angle,rotationLocation,displayWidth,displayHeight,currentColor);
    requestAnimationFrame(update);
  }

  update();

}



function draw(gl, program,angle, rotationLocation, displayWidth, displayHeight, currentColor) {
  gl.clearColor(1.0, 1.0, 1.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  const aspectRatio = displayWidth / displayHeight;
  const scaleX = aspectRatio > 1 ? 1.0 / aspectRatio : 1.0;
  const scaleY = aspectRatio > 1 ? 1.0 : aspectRatio;

  const rMatrix = [
      Math.cos(angle) * scaleX , -Math.sin(angle) * scaleY, 0,
      Math.sin(angle) * scaleX , Math.cos(angle) * scaleY, 0,
      0,              0,                1
  ];

  gl.uniformMatrix3fv(rotationLocation, false, rMatrix);

  const bezierPoints_0 = bezier_quadratic([-0.03, 0.9], [0.0, 1.0], [0.03, 0.9]);
  bezierPoints_0.push([0.03, -0.7]);
  const bezierPoints_1 = bezier_quadratic([0.03, -0.7], [-0.135, -1.2], [-0.3, -0.7]);
  bezierPoints_1.splice(0, 1);
  bezierPoints_1.push([-0.25, -0.7]);
  const bezierPoints_2 = bezier_quadratic([-0.25, -0.7], [-0.14, -0.9], [-0.03, -0.7]);
  bezierPoints_2.splice(0, 1);

  const handlePoints = [];
  handlePoints.push(...bezierPoints_0);
  handlePoints.push(...bezierPoints_1);
  handlePoints.push(...bezierPoints_2);

  const triangles = earTriangulation(handlePoints);

  const positions = [];
  triangles.forEach(triangle => {
    triangle.forEach(vertex => {
      positions.push(...vertex);
    });
  });

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  const positionAttributeLocation = gl.getAttribLocation(program, "aPosition");
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

  const colorLocation = gl.getUniformLocation(program, "uColor");
  gl.uniform4fv(colorLocation, [0.0,0.0,0.0,1.0]);
  gl.drawArrays(gl.TRIANGLES, 0, positions.length / 2);


  const bezierPoints_3 = bezier_quadratic([-0.6, 0.3], [0.0, 1.3], [0.6, 0.3]);
  const bezierPoints_4 = bezier_quadratic([-0.6, 0.3], [-0.4, 0.5], [-0.2, 0.3]);
  bezierPoints_4.splice(0, 1);
  bezierPoints_4.reverse();
  const bezierPoints_5= bezier_quadratic([-0.2, 0.3], [0.0, 0.5], [0.2, 0.3]);
  bezierPoints_5.splice(0, 1);
  bezierPoints_5.reverse();
  const bezierPoints_6 = bezier_quadratic([0.2, 0.3], [0.4, 0.5], [0.6, 0.3]);
  bezierPoints_6.splice(0, 1);
  bezierPoints_6.splice(bezierPoints_6.length - 1, 1);
  bezierPoints_6.reverse();

  const fabricPoints = [];
  fabricPoints.push(...bezierPoints_3);
  fabricPoints.push(...bezierPoints_6);
  fabricPoints.push(...bezierPoints_5);
  fabricPoints.push(...bezierPoints_4);

  const triangles_2 = earTriangulation(fabricPoints);

  const positions_2 = [];
  triangles_2.forEach(triangle => {
    triangle.forEach(vertex => {
      positions_2.push(...vertex);
    });
  });


  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions_2), gl.STATIC_DRAW);
  gl.uniform4fv(colorLocation, currentColor);
  gl.drawArrays(gl.TRIANGLES, 0, positions_2.length / 2);

}
