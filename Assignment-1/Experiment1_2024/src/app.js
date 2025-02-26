"use strict";

main();

function main() {
  const canvas = document.querySelector('#glCanvas');


  const displayWidth = window.innerWidth;
  const displayHeight = window.innerHeight;

  if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
    canvas.width = displayWidth;
    canvas.height = displayHeight;
  }

  const gl = canvas.getContext('webgl');

  gl.clearColor(1.0, 1.0, 1.0, 1.0); //White Background
  gl.clear(gl.COLOR_BUFFER_BIT);

  const program = initShaderProgram(gl, vsSource, fsSource);

  gl.useProgram(program);

  const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
  const colorUniformLocation = gl.getUniformLocation(program, 'u_color');

  const bezierLine_1 = bezier_linear([-0.03, 0.9], [0.03, 0.9]);
  const bezierLine_2 = bezier_linear([-0.03, -0.7], [0.03, -0.7]);
  const bezierLine_3 = bezier_linear([-0.03, 0.9], [-0.03, -0.7]);
  const bezierLine_4 = bezier_linear([0.03, 0.9], [0.03, -0.7]);            // Handle rectangle part using bezier_linear function
  const bezierLines = [];
  bezierLines.push(...bezierLine_1);
  bezierLines.push(...bezierLine_2);
  bezierLines.push(...bezierLine_3);
  bezierLines.push(...bezierLine_4);
  const triangulationIndexes = triangulation(bezierLines);
  initBuffer(gl, bezierLines, Float32Array);
  initBuffer(gl, triangulationIndexes, Uint16Array);
  draw(gl, positionAttributeLocation, colorUniformLocation, triangulationIndexes.length, [0.0, 0.0, 0.0, 1.0]);

  const bezierPoints_0 = bezier_quadratic([-0.03,0.9],[0.0,1.0],[0.03,0.9]);
  const triangulationIndexes_0 = triangulation(bezierPoints_0);                                             // Top of the handle using bezier_quadratic curve
  initBuffer(gl,bezierPoints_0,Float32Array);
  initBuffer(gl,triangulationIndexes_0,Uint16Array);
  draw(gl,positionAttributeLocation,colorUniformLocation,triangulationIndexes_0.length, [0.0, 0.0, 0.0, 1.0]);


  const bezierPoints_1 = bezier_quadratic([-0.6, 0.3], [0.0, 1.3], [0.6, 0.3]);
  const triangulationIndexes_1 = triangulation(bezierPoints_1);
  initBuffer(gl,bezierPoints_1,Float32Array);                                                                           // Big part of the fabric using bezier_quadratic curve
  initBuffer(gl,triangulationIndexes_1,Uint16Array);
  draw(gl,positionAttributeLocation,colorUniformLocation,triangulationIndexes_1.length, [1.0, 0.0, 0.0, 1.0]);

  const bezierPoints_2 = bezier_quadratic([-0.6, 0.3], [-0.4, 0.5], [-0.2, 0.3]);
  const triangulationIndexes_2 = triangulation(bezierPoints_2);
  initBuffer(gl,bezierPoints_2,Float32Array);                                                                           // Rest of the three code blocks is the small parts of the fabric using bezier_quadratic curve
  initBuffer(gl,triangulationIndexes_2,Uint16Array);
  draw(gl,positionAttributeLocation,colorUniformLocation,triangulationIndexes_2.length, [1.0, 1.0, 1.0, 1.0]);

  const bezierPoints_3 = bezier_quadratic([-0.2, 0.3], [0.0, 0.5], [0.2, 0.3]);
  const triangulationIndexes_3 = triangulation(bezierPoints_3);
  initBuffer(gl,bezierPoints_3,Float32Array);
  initBuffer(gl,triangulationIndexes_3,Uint16Array);
  draw(gl,positionAttributeLocation,colorUniformLocation,triangulationIndexes_3.length, [1.0, 1.0, 1.0, 1.0]);


  const bezierPoints_4 = bezier_quadratic([0.2, 0.3], [0.4, 0.5], [0.6, 0.3]);
  const triangulationIndexes_4 = triangulation(bezierPoints_4);
  initBuffer(gl,bezierPoints_4,Float32Array);
  initBuffer(gl,triangulationIndexes_4,Uint16Array);
  draw(gl,positionAttributeLocation,colorUniformLocation,triangulationIndexes_4.length, [1.0, 1.0, 1.0, 1.0]);

  const bezierLine_5 = bezier_linear([-0.03, 0.4], [0.03, 0.4]);
  const bezierLine_6 = bezier_linear([-0.03, 0.3], [0.03, 0.3]);
  const bezierLine_7 = bezier_linear([-0.03, 0.4], [-0.03, 0.3]);
  const bezierLine_8 = bezier_linear([0.03, 0.4], [0.03, 0.3]);
  const bezierLiness = [];                                                                                        // Middle rectangle part of the handle because of missing depth
  bezierLiness.push(...bezierLine_5);
  bezierLiness.push(...bezierLine_6);
  bezierLiness.push(...bezierLine_7);
  bezierLiness.push(...bezierLine_8);
  const triangulationIndexes_01 = triangulation(bezierLiness);
  initBuffer(gl, bezierLiness, Float32Array);
  initBuffer(gl, triangulationIndexes_01, Uint16Array);
  draw(gl, positionAttributeLocation, colorUniformLocation, triangulationIndexes_01.length, [0.0, 0.0, 0.0, 1.0]);

  const bezierPoints_5 = bezier_quadratic([0.03, -0.7], [-0.135, -1.2], [-0.3, -0.7]);
  const triangulationIndexes_5 = triangulation(bezierPoints_5);
  initBuffer(gl,bezierPoints_5,Float32Array);                                                                           // Bottom handle parts using bezier_quadratic
  initBuffer(gl,triangulationIndexes_5,Uint16Array);
  draw(gl,positionAttributeLocation,colorUniformLocation,triangulationIndexes_5.length, [0.0, 0.0, 0.0, 1.0]);

  const bezierPoints_6 = bezier_quadratic([-0.03, -0.7], [-0.14, -0.9], [-0.25, -0.7]);
  const triangulationIndexes_6 = triangulation(bezierPoints_5);
  initBuffer(gl,bezierPoints_6,Float32Array);
  initBuffer(gl,triangulationIndexes_6,Uint16Array);
  draw(gl,positionAttributeLocation,colorUniformLocation,triangulationIndexes_6.length, [1.0, 1.0, 1.0, 1.0]);

}