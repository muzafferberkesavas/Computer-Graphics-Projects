function triangulation(points) {

  const indices = [];

  for (let i = 2; i < points.length / 2; i++) {
      indices.push(0, i - 1 , i);
  }

  return indices;

}