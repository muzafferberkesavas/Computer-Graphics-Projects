"use strict";


const vertexShaderSource = `#version 300 es
in vec2 aPosition;
uniform mat3 uTransform; // Transformasyonu temsil eden matris
void main() {
    vec3 transformedPosition = uTransform * vec3(aPosition, 1.0);
    gl_Position = vec4(transformedPosition.xy, 0.0, 1.0);
}`;

const fragmentShaderSource = `#version 300 es
precision mediump float;
uniform vec4 uColor;
out vec4 fragColor;
void main() {
    fragColor = uColor; 
}`;


const canvas = document.getElementById("webglCanvas");
const gl = canvas.getContext("webgl2");
const scaleSlider = document.getElementById("scaleSlider");
const drawButton = document.getElementById("drawButton");
const clearButton = document.getElementById("clearButton");
const fillButton = document.getElementById("fillButton");
const upButton = document.getElementById("upButton");
const downButton = document.getElementById("downButton");
const leftButton = document.getElementById("leftButton");
const rightButton = document.getElementById("rightButton");
const rotateClockwiseButton = document.getElementById("rotateClockwiseButton");
const rotateCounterclockwiseButton = document.getElementById("rotateCounterclockwiseButton");
const colorPicker = document.getElementById("colorPicker");


let vertices = [];
let vertices2 = [];

let isFill = false;
let isDrawing = false;
let currentColor = [1.0, 0.0, 0.0, 1.0];


const program = createProgram(gl, vertexShaderSource, fragmentShaderSource);


const aPositionLoc = gl.getAttribLocation(program, "aPosition");
const uTransformLoc = gl.getUniformLocation(program, "uTransform");
const uColorLoc = gl.getUniformLocation(program, "uColor");


const positionBuffer = gl.createBuffer();


let translation = [0, 0];
let rotation = 0;
let scale = 1;

fillButton.addEventListener("click", () => {
    if (vertices2.length > 2) {
        if(isClockwise(vertices2)) {
            const triangles = earTriangulation(vertices2);
            renderFilledTriangles(triangles, currentColor);
            isFill = true;
        }else{
            const triangles = earTriangulation(vertices2.reverse());
            renderFilledTriangles(triangles, currentColor);
            isFill = true;
        }
    }
})

rotateClockwiseButton.addEventListener("click", (e) => {
    rotation += 0.2;
    drawScene();
    if (isFill) {
        if(isClockwise(vertices2)) {
            const triangles = earTriangulation(vertices2);
            renderFilledTriangles(triangles, currentColor);
            isFill = true;
        }else{
            const triangles = earTriangulation(vertices2.reverse());
            renderFilledTriangles(triangles, currentColor);
            isFill = true;
        }
    }
})

rotateCounterclockwiseButton.addEventListener("click", (e) => {
    rotation -= 0.2;
    drawScene();
    if (isFill) {
        if(isClockwise(vertices2)) {
            const triangles = earTriangulation(vertices2);
            renderFilledTriangles(triangles, currentColor);
            isFill = true;
        }else{
            const triangles = earTriangulation(vertices2.reverse());
            renderFilledTriangles(triangles, currentColor);
            isFill = true;
        }
    }
})

upButton.addEventListener("click", (e) => {
    translation[1] += 0.1;
    drawScene();
    if (isFill) {
        if(isClockwise(vertices2)) {
            const triangles = earTriangulation(vertices2);
            renderFilledTriangles(triangles, currentColor);
            isFill = true;
        }else{
            const triangles = earTriangulation(vertices2.reverse());
            renderFilledTriangles(triangles, currentColor);
            isFill = true;
        }
    }
})

downButton.addEventListener("click", (e) => {
    translation[1] -= 0.1;
    drawScene();
    if (isFill) {
        if(isClockwise(vertices2)) {
            const triangles = earTriangulation(vertices2);
            renderFilledTriangles(triangles, currentColor);
            isFill = true;
        }else{
            const triangles = earTriangulation(vertices2.reverse());
            renderFilledTriangles(triangles, currentColor);
            isFill = true;
        }
    }
})

leftButton.addEventListener("click", (e) => {
    translation[0] -= 0.1;
    drawScene();
    if (isFill) {
        if(isClockwise(vertices2)) {
            const triangles = earTriangulation(vertices2);
            renderFilledTriangles(triangles, currentColor);
            isFill = true;
        }else{
            const triangles = earTriangulation(vertices2.reverse());
            renderFilledTriangles(triangles, currentColor);
            isFill = true;
        }
    }
})
rightButton.addEventListener("click", (e) => {
    translation[0] += 0.1;
    drawScene();
    if (isFill) {
        if(isClockwise(vertices2)) {
            const triangles = earTriangulation(vertices2);
            renderFilledTriangles(triangles, currentColor);
            isFill = true;
        }else{
            const triangles = earTriangulation(vertices2.reverse());
            renderFilledTriangles(triangles, currentColor);
            isFill = true;
        }
    }
})


drawButton.addEventListener("click", () => {
    isDrawing = !isDrawing;
    canvas.style.cursor = isDrawing ? "crosshair" : "default";
});


canvas.addEventListener("click", (event) => {
    if (isDrawing) {
        const rect = canvas.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / canvas.width) * 2 - 1;
        const y = -((event.clientY - rect.top) / canvas.height) * 2 + 1;

        vertices.push(x, y);
        vertices2.push([x, y]);

        drawScene();
    }
});


scaleSlider.addEventListener("input", () => {
    scale = parseFloat(scaleSlider.value);
    drawScene();
});


colorPicker.addEventListener("input", (event) => {
    const hexColor = event.target.value;
    currentColor = hexToRgbA(hexColor);
    drawScene();
    if (isFill) {
        if(isClockwise(vertices2)) {
            const triangles = earTriangulation(vertices2);
            renderFilledTriangles(triangles, currentColor);
            isFill = true;
        }else{
            const triangles = earTriangulation(vertices2.reverse());
            renderFilledTriangles(triangles, currentColor);
            isFill = true;
        }
    }
});


clearButton.addEventListener("click", () => {
    vertices = [];
    vertices2 = [];
    isFill = false;

    translation = [0,0];
    rotation = 0;
    scale = 1;
    scaleSlider.value = 1;
    scaleValueDisplay.textContent = "1.0";
    updateSliderStyle();

    drawScene();
});


const scaleValueDisplay = document.getElementById("scaleValue");


scaleSlider.addEventListener("input", function() {
    scale = parseFloat(scaleSlider.value);
    scaleValueDisplay.textContent = scale.toFixed(1);
    drawScene();
    if (isFill) {
        if(isClockwise(vertices2)) {
            const triangles = earTriangulation(vertices2);
            renderFilledTriangles(triangles, currentColor);
            isFill = true;
        }else{
            const triangles = earTriangulation(vertices2.reverse());
            renderFilledTriangles(triangles, currentColor);
            isFill = true;
        }
    }
});


document.addEventListener("DOMContentLoaded", function() {
    scaleValueDisplay.textContent = scaleSlider.value;
});





function updateSliderStyle() {
    const value = parseFloat(scaleSlider.value);
    const percentage = ((value - 0.1) / (3.0 - 0.1)) * 100;


    scaleSlider.style.background = `linear-gradient(to right, 
        #0000ff ${percentage}%, 
        #d3d3d3 ${percentage}%)`;


    scaleValueDisplay.textContent = value.toFixed(1);
}


scaleSlider.addEventListener("input", updateSliderStyle);


document.addEventListener("DOMContentLoaded", updateSliderStyle);


function drawScene() {
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    if (vertices.length === 0) return;

    gl.useProgram(program);


    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(aPositionLoc);
    gl.vertexAttribPointer(aPositionLoc, 2, gl.FLOAT, false, 0, 0);


    const cos = Math.cos(rotation);
    const sin = Math.sin(rotation);
    const transformMatrix = new Float32Array([
        cos * scale, -sin * scale, 0,
        sin * scale, cos * scale,  0,
        translation[0], translation[1], 1
    ]);
    gl.uniformMatrix3fv(uTransformLoc, false, transformMatrix);
    gl.uniform4fv(uColorLoc, currentColor);
    gl.drawArrays(gl.LINE_STRIP, 0, vertices.length / 2);
}


function createProgram(gl, vertexSource, fragmentSource) {
    const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error("Program bağlantısı başarısız: " + gl.getProgramInfoLog(program));
    }
    return program;
}


function compileShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw new Error("Shader derlemesi başarısız: " + gl.getShaderInfoLog(shader));
    }
    return shader;
}


function hexToRgbA(hex) {
    const bigint = parseInt(hex.slice(1), 16);
    return [
        ((bigint >> 16) & 255) / 255,
        ((bigint >> 8) & 255) / 255,
        (bigint & 255) / 255,
        1.0
    ];
}
function renderFilledTriangles(triangles, color) {

    const vertices = [];
    triangles.forEach(triangle => {

        triangle.forEach(vertex => {
            vertices.push(vertex[0], vertex[1]);
        });
    });

    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);


    gl.uniform4fv(uColorLoc, color);


    const aPositionLocation = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttribPointer(aPositionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aPositionLocation);


    gl.clear(gl.COLOR_BUFFER_BIT); // Önce ekranı temizle
    gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 2);
}

function isClockwise(vertices) {
    let sum = 0;

    for (let i = 0; i < vertices.length; i++) {
        const x1 = vertices[i][0];
        const y1 = vertices[i][1];
        const x2 = vertices[(i + 1) % vertices.length][0];
        const y2 = vertices[(i + 1) % vertices.length][1];

        sum += (x2 - x1) * (y2 + y1);
    }

    return sum > 0;
}

drawScene();
