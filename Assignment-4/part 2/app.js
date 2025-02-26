
const canvas = document.getElementById("glCanvas");
const gl = canvas.getContext("webgl2");


function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();


gl.clearColor(0.0, 0.0, 0.0, 1.0);



const vertexShaderSource = `
    attribute vec3 aPosition;
    attribute vec3 aNormal;
    uniform mat4 uModelViewProjectionMatrix;
    varying vec3 vNormal;

    void main() {
        gl_Position = uModelViewProjectionMatrix * vec4(aPosition, 1.0);
        vNormal = aNormal; 
    }
`;

const fragmentShaderSource = `
    precision mediump float;
    varying vec3 vNormal;

    void main() {
        vec3 lightDirection = normalize(vec3(1.0, 1.0, 1.0));
        vec3 ambientLight = vec3(0.5, 0.5, 0.5); 
        vec3 diffuseColor = vec3(1.0, 1.0, 1.0); 

        float diff = max(dot(vNormal, lightDirection), 0.0);
        vec3 diffuse = diff * diffuseColor;

        vec3 viewDirection = normalize(-gl_FragCoord.xyz);
        vec3 halfVector = normalize(lightDirection + viewDirection);
        float specular = pow(max(dot(vNormal, halfVector), 0.0), 32.0);
        vec3 specularColor = vec3(1.0, 1.0, 1.0);

        gl_FragColor = vec4(ambientLight + diffuse + specular, 1.0);
    }
`;




async function main() {

    const objData = await loadObj("monkey_head.obj");

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    const program = createProgram(gl, vertexShader, fragmentShader);

    // Vertex ve normal verilerini buffer'a yükle
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(objData.vertices), gl.STATIC_DRAW);

    const normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(objData.normals), gl.STATIC_DRAW);

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(objData.indices), gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, "aPosition");
    const normalLocation = gl.getAttribLocation(program, "aNormal");

    const modelMatrixLocation = gl.getUniformLocation(program, "uModelMatrix");
    const mvpMatrixLocation = gl.getUniformLocation(program, "uModelViewProjectionMatrix");

    const modelMatrices = [
        mat4.create(), //first monkey
        mat4.create(), //second monkey
        mat4.create()  //third monkey
    ];

    const viewMatrix = mat4.create();
    const projectionMatrix = mat4.create();
    const modelViewProjectionMatrix = mat4.create();

    let rotationAngle = 0;
    let distance = 0;
    let upDown = 0;


    let cameraPosition = vec3.fromValues(0, 0, -5);
    let cameraRotation = vec3.fromValues(0, 0, 0);
    let cameraZoom = 1.0;


    let isDragging = false;
    let lastMouseX = 0;
    let lastMouseY = 0;

    canvas.addEventListener("mousedown", (event) => {
        isDragging = true;
        lastMouseX = event.clientX;
        lastMouseY = event.clientY;
    });

    canvas.addEventListener("mouseup", () => {
        isDragging = false;
    });

    canvas.addEventListener("mousemove", (event) => {
        if (isDragging) {
            const deltaX = event.clientX - lastMouseX;
            const deltaY = event.clientY - lastMouseY;

            if (event.button === 0) {
                cameraRotation[1] -= deltaX * 0.01;
                cameraRotation[0] -= deltaY * 0.01;
                cameraRotation[0] = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, cameraRotation[0]));
            } else if (event.button === 1) {
                cameraZoom -= deltaY * 0.01;
                cameraZoom = Math.max(0.1, cameraZoom);
            } else if (event.button === 2) {
                cameraPosition[0] -= deltaX * 0.01;
                cameraPosition[1] += deltaY * 0.01;
            }

            lastMouseX = event.clientX;
            lastMouseY = event.clientY;
        }
    });



    function render() {
        rotationAngle += 0.01;
        distance += 0.02;
        upDown += 0.01;


        mat4.identity(viewMatrix);
        mat4.rotateX(viewMatrix, viewMatrix, cameraRotation[0]);
        mat4.rotateY(viewMatrix, viewMatrix, cameraRotation[1]);
        mat4.translate(viewMatrix, viewMatrix, cameraPosition);
        mat4.scale(viewMatrix, viewMatrix, [cameraZoom, cameraZoom, cameraZoom]);


        mat4.identity(modelMatrices[0]);
        mat4.translate(modelMatrices[0], modelMatrices[0], [-5, 0, -10 + Math.sin(distance) * 5]);

        mat4.identity(modelMatrices[1]);
        mat4.translate(modelMatrices[1], modelMatrices[1], [5, Math.sin(upDown) * 2, -10]);

        mat4.identity(modelMatrices[2]);
        mat4.translate(modelMatrices[2], modelMatrices[2], [0, 0, -10]);
        mat4.rotateY(modelMatrices[2], modelMatrices[2], rotationAngle);


        mat4.perspective(
            projectionMatrix,
            Math.PI / 4,
            canvas.width / canvas.height,
            0.1,
            100
        );

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.enable(gl.DEPTH_TEST);

        gl.useProgram(program);

        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        gl.enableVertexAttribArray(normalLocation);
        gl.vertexAttribPointer(normalLocation, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

        for (let i = 0; i < modelMatrices.length; i++) {
            mat4.multiply(modelViewProjectionMatrix, projectionMatrix, viewMatrix);
            mat4.multiply(modelViewProjectionMatrix, modelViewProjectionMatrix, modelMatrices[i]);
            gl.uniformMatrix4fv(mvpMatrixLocation, false, modelViewProjectionMatrix);
            gl.drawElements(gl.TRIANGLES, objData.indices.length, gl.UNSIGNED_SHORT, 0);
        }

        requestAnimationFrame(render);
    }

    render();
}

main();

