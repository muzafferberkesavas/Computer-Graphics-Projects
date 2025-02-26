function bezier_quadratic(p0,p1,p2) {

    const points =[];

    for(let t = 0; t <= 1 ; t += 0.01){

      const x = (((1 - t) ** 2) * p0[0]) + (2 * (1-t) * t * p1[0]) + ((t ** 2) * p2[0]);

      const y = (((1 - t) ** 2) * p0[1]) + (2 * (1-t) * t * p1[1]) + ((t ** 2) * p2[1]);

      points.push([x,y]);
    }

    return points;

}

