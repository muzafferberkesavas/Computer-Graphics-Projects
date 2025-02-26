function earTriangulation(points) {
    const copyPoints = points.slice();
    const triangles = [];
    while (copyPoints.length > 3) {
        let foundEar = false;
        for (let i = 0; i < copyPoints.length; i++) {
            const currentIndex = i;
            const previousIndex = (i - 1 + copyPoints.length) % copyPoints.length;
            const nextIndex = (i + 1) % copyPoints.length;

            const vecA = copyPoints[previousIndex];
            const vecB = copyPoints[currentIndex];
            const vecC = copyPoints[nextIndex];
            const vecA_B = [vecB[0] - vecA[0], vecB[1] - vecA[1]];
            const vecA_C = [vecC[0] - vecA[0], vecC[1] - vecA[1]];

            if (crossProduct(vecA_B, vecA_C) < 0) {
                let isEar = true;
                for (let j = 0; j < copyPoints.length; j++) {
                    if (j === currentIndex || j === previousIndex || j === nextIndex) {
                        continue;
                    }
                    const point = copyPoints[j];
                    if (isPointInTriangle(point, vecA, vecB, vecC)) {
                        isEar = false;
                        break;
                    }
                }
                if (isEar) {
                    triangles.push([copyPoints[previousIndex], copyPoints[currentIndex], copyPoints[nextIndex]]);
                    copyPoints.splice(i, 1);
                    foundEar = true;
                    break;
                }
            }
        }
        if (!foundEar) {
            break;
        }
    }
    triangles.push([copyPoints[0], copyPoints[1], copyPoints[2]]);
    return triangles;
}

function crossProduct(vectorA, vectorB) {
    return vectorA[0] * vectorB[1] - vectorA[1] * vectorB[0];
}

function isPointInTriangle(point, vectorA, vectorB, vectorC) {
    const vecA_B = [vectorB[0] - vectorA[0], vectorB[1] - vectorA[1]];
    const vecB_C = [vectorC[0] - vectorB[0], vectorC[1] - vectorB[1]];
    const vecC_A = [vectorA[0] - vectorC[0], vectorA[1] - vectorC[1]];

    const vecA_P = [point[0] - vectorA[0], point[1] - vectorA[1]];
    const vecB_P = [point[0] - vectorB[0], point[1] - vectorB[1]];
    const vecC_P = [point[0] - vectorC[0], point[1] - vectorC[1]];

    const cross_1 = crossProduct(vecA_B, vecA_P);
    const cross_2 = crossProduct(vecB_C, vecB_P);
    const cross_3 = crossProduct(vecC_A, vecC_P);

    return (cross_1 > 0 && cross_2 > 0 && cross_3 > 0) || (cross_1 < 0 && cross_2 < 0 && cross_3 < 0);
}
