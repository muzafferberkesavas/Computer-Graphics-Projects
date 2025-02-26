function draw(gl, positionAttributeLocation, colorUniformLocation, length, color) {

  gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.uniform4fv(colorUniformLocation, color);
  gl.drawElements(gl.TRIANGLES, length, gl.UNSIGNED_SHORT, 0);

}

