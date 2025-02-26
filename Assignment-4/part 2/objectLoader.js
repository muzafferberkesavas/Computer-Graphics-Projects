async function loadObj(fileUrl) {
    const response = await fetch(fileUrl);
    const text = await response.text();
    const vertices = [];
    const normals = [];
    const indices = [];

    const lines = text.split("\n");
    for (const line of lines) {
        if (line.startsWith("v ")) {
            const [, x, y, z] = line.split(" ");
            vertices.push(parseFloat(x), parseFloat(y), parseFloat(z));
        } else if (line.startsWith("vn ")) {
            const [, nx, ny, nz] = line.split(" ");
            normals.push(parseFloat(nx), parseFloat(ny), parseFloat(nz));
        } else if (line.startsWith("f ")) {
            const [, ...faceIndices] = line.split(" ");
            for (let i = 1; i < faceIndices.length - 1; i++) {
                indices.push(
                    parseInt(faceIndices[0].split("//")[0]) - 1,
                    parseInt(faceIndices[i].split("//")[0]) - 1,
                    parseInt(faceIndices[i + 1].split("//")[0]) - 1
                );
            }
        }
    }
    return { vertices, normals, indices };
}