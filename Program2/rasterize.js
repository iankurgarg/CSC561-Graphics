/* GLOBAL CONSTANTS AND VARIABLES */

/* assignment specific globals */
const WIN_Z = 0;  // default graphics window z coord in world space
const WIN_LEFT = 0; const WIN_RIGHT = 1;  // default left and right x coords in world space
const WIN_BOTTOM = 0; const WIN_TOP = 1;  // default top and bottom y coords in world space
const INPUT_TRIANGLES_URL = "https://ncsucgclass.github.io/prog2/triangles.json"; // triangles file loc
const INPUT_SPHERES_URL = "https://ncsucgclass.github.io/prog2/ellipsoids.json"; // ellipsoids file loc
var Eye = new vec4.fromValues(0.5,0.5,-0.5,1.0); // default eye position in world space

/* webgl globals */
var gl = null; // the all powerful gl object. It's all here folks!
var shaderProgram;
var mvmatrix = mat4.create();   //ModelView Transformation Matrix
var pmatrix = mat4.create();    //Projection Matrix

var vertexBuffer = []; // this contains vertex coordinates in triples
var normalBuffer = [];
var triangleBuffer = []; // this contains indices into vertexBuffer in triples
var inputTriangles;
var triangle_centrois = [];

//Buffers for ellipsoids
var inputEllipsoids;
var ellipsoidsNormalBuffer = [];
var ellipsoidsVertexPositionBuffer = [];
var ellipsiodsVertexIndexBuffer = [];

var triBufferSize = 0; // the number of indices in the triangle buffer

var vertexPositionAttrib; // where to put position for vertex shader
var vertexNormalAttrib; // where to put normals for each vertex
var vertexAmbientColorAttrib; // where to put color for vertex shader
var vertexDiffuseColorAttrib; // where to put color for vertex shader
var vertexSpecularColorAttrib; // where to put color for vertex shader

var LightPos = [-1, 3, -0.5];
var LightColor = [1.0, 1.0, 1.0];
var Eye = [0.5, 0.5, -0.5];
var Up = [0, 1, 0];
var Center = [0.5, 0.5, 1];

var highlight_ellipsoid_index = -1;
var highlight_triangle_index = -1;
var phong = true;

var ellipsoid_translations = [];
var triangle_translations = [];
var transformTriangles = [];
var transformEllipsoids = [];


// ASSIGNMENT HELPER FUNCTIONS

// get the JSON file from the passed URL
function getJSONFile(url,descr) {
    try {
        if ((typeof(url) !== "string") || (typeof(descr) !== "string"))
            throw "getJSONFile: parameter not a string";
        else {
            var httpReq = new XMLHttpRequest(); // a new http request
            httpReq.open("GET",url,false); // init the request
            httpReq.send(null); // send the request
            var startTime = Date.now();
            while ((httpReq.status !== 200) && (httpReq.readyState !== XMLHttpRequest.DONE)) {
                if ((Date.now()-startTime) > 3000)
                    break;
            } // until its loaded or we time out after three seconds
            if ((httpReq.status !== 200) || (httpReq.readyState !== XMLHttpRequest.DONE))
                throw "Unable to open "+descr+" file!";
            else
                return JSON.parse(httpReq.response); 
        } // end if good params
    } // end try    
    
    catch(e) {
        console.log(e);
        return(String.null);
    }
} // end get json file

// set up the webGL environment
function setupWebGL() {

    // Get the canvas and context
    var canvas = document.getElementById("myWebGLCanvas"); // create a js canvas
    gl = canvas.getContext("webgl"); // get a webgl object from it
    
    try {
      if (gl == null) {
        throw "unable to create gl context -- is your browser gl ready?";
      } else {
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
        gl.clearColor(0.0, 0.0, 0.0, 1.0); // use black when we clear the frame buffer
        gl.clearDepth(1.0); // use max when we clear the depth buffer
        gl.enable(gl.DEPTH_TEST); // use hidden surface removal (with zbuffering)
      }
    } // end try
    
    catch(e) {
      console.log(e);
    } // end catch
 
} // end setupWebGL


function loadEllipsoids() {
    inputEllipsoids = getJSONFile(INPUT_SPHERES_URL, "spheres");
    
    if (inputEllipsoids != null) {
        for (var i = 0; i < inputEllipsoids.length; i++) {
            var indexOffset = 0;
            var vertexPositionData = [];
            var normalData = [];
            var indexData = [];

            var latitudeBands = 30;
            var longitudeBands = 30;
            var radius = [inputEllipsoids[i].a, inputEllipsoids[i].b, inputEllipsoids[i].c];
            var center = [inputEllipsoids[i].x, inputEllipsoids[i].y, inputEllipsoids[i].z];

            transformEllipsoids[i] = vec3.create();
            ellipsoid_translations[i] = vec3.create();
            
            for (var latNumber = 0; latNumber <= latitudeBands; latNumber++) {
                var theta = latNumber * Math.PI / latitudeBands;
                var sinTheta = Math.sin(theta);
                var cosTheta = Math.cos(theta);

                for (var longNumber=0; longNumber <= longitudeBands; longNumber++) {
                    var phi = longNumber * 2 * Math.PI / longitudeBands;
                    var sinPhi = Math.sin(phi);
                    var cosPhi = Math.cos(phi);

                    var x = cosPhi * sinTheta;
                    var y = cosTheta;
                    var z = sinPhi * sinTheta;
                    
                    var ex = (radius[0] * x) + center[0];
                    var ey = (radius[1] * y) + center[1];
                    var ez = (radius[2] * z) + center[2];

                    vertexPositionData.push(ex, ey, ez);

                    normalData.push(x/radius[0], y/radius[1], z/radius[2]);
                }
            }

            for (var latNumber=0; latNumber < latitudeBands; latNumber++) {
                for (var longNumber=0; longNumber < longitudeBands; longNumber++) {
                    var first = (latNumber * (longitudeBands + 1)) + longNumber + indexOffset;
                    var second = first + longitudeBands + 1;
                    indexData.push(first, second, first + 1);
                    indexData.push(second, second + 1, first + 1);
                }
            }
            // indexOffset = vertexPositionData.length/3;

            ellipsoidsNormalBuffer[i] = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, ellipsoidsNormalBuffer[i]);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalData), gl.STATIC_DRAW);
            ellipsoidsNormalBuffer[i].itemSize = 3;
            ellipsoidsNormalBuffer[i].numItems = normalData.length / 3;

            ellipsoidsVertexPositionBuffer[i] = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, ellipsoidsVertexPositionBuffer[i]);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPositionData), gl.STATIC_DRAW);
            ellipsoidsVertexPositionBuffer[i].itemSize = 3;
            ellipsoidsVertexPositionBuffer[i].numItems = vertexPositionData.length / 3;

            ellipsiodsVertexIndexBuffer[i] = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ellipsiodsVertexIndexBuffer[i]);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexData), gl.STATIC_DRAW);
            ellipsiodsVertexIndexBuffer[i].itemSize = 1;
            ellipsiodsVertexIndexBuffer[i].numItems = indexData.length;
        }



    }
}

// read triangles in, load them into webgl buffers
function loadTriangles() {
    inputTriangles = getJSONFile(INPUT_TRIANGLES_URL,"triangles");

    if (inputTriangles != String.null) {         
        for (var whichSet=0; whichSet<inputTriangles.length; whichSet++) {

            var whichSetVert; // index of vertex in current triangle set
            var whichSetTri; // index of triangle in current triangle set
            var coordArray = []; // 1D array of vertex coords for WebGL
            var indexArray = []; // 1D array of vertex indices for WebGL
            var vtxBufferSize = 0; // the number of vertices in the vertex buffer
            var vtxToAdd = []; // vtx coords to add to the coord array
            var indexOffset = vec3.create(); // the index offset for the current set
            var triToAdd = vec3.create(); // tri indices to add to the index array
            var normalData = [];
            var col = vec3.create();
            triBufferSize = 0;

            var normals = inputTriangles[whichSet].normals;

            transformTriangles[whichSet] = vec3.create();
            triangle_translations[whichSet] = vec3.create();

            vec3.set(indexOffset,vtxBufferSize,vtxBufferSize,vtxBufferSize); // update vertex offset

            // handles scaling of triangle set
            var centroid = vec3.create();
            for (whichSetTri=0; whichSetTri<inputTriangles[whichSet].vertices.length; whichSetTri++) {
                var vtx = inputTriangles[whichSet].vertices[whichSetTri];
                vec3.add(centroid, centroid, vtx);
            }
            vec3.scale(centroid, centroid, 1/inputTriangles[whichSet].vertices.length);
            triangle_centrois[whichSet] = centroid;
            
            // set up the vertex coord array
            for (whichSetVert=0; whichSetVert<inputTriangles[whichSet].vertices.length; whichSetVert++) {
                vtxToAdd = inputTriangles[whichSet].vertices[whichSetVert];
                coordArray.push(vtxToAdd[0],vtxToAdd[1],vtxToAdd[2]);
                normalData.push(normals[whichSetVert][0], normals[whichSetVert][1], normals[whichSetVert][2]);
            } // end for vertices in set
            
            // set up the triangle index array, adjusting indices across sets
            for (whichSetTri=0; whichSetTri<inputTriangles[whichSet].triangles.length; whichSetTri++) {
                vec3.add(triToAdd,indexOffset,inputTriangles[whichSet].triangles[whichSetTri]);
                indexArray.push(triToAdd[0],triToAdd[1],triToAdd[2]);
            } // end for triangles in set

            vtxBufferSize += inputTriangles[whichSet].vertices.length; // total number of vertices
            triBufferSize += inputTriangles[whichSet].triangles.length; // total number of tris

            vertexBuffer[whichSet] = gl.createBuffer(); // init empty vertex coord buffer
            gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer[whichSet]); // activate that buffer
            gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(coordArray),gl.STATIC_DRAW); // coords to that buffer
            vertexBuffer[whichSet].itemSize = 3;

            normalBuffer[whichSet] = gl.createBuffer(); // init empty vertex coord buffer
            gl.bindBuffer(gl.ARRAY_BUFFER,normalBuffer[whichSet]); // activate that buffer
            gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(normalData),gl.STATIC_DRAW); // coords to that buffer
            normalBuffer[whichSet].itemSize = 3;
            
            // send the triangle indices to webGL
            triangleBuffer[whichSet] = gl.createBuffer(); // init empty triangle index buffer
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, triangleBuffer[whichSet]); // activate that buffer
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(indexArray),gl.STATIC_DRAW); // indices to that buffer

            triBufferSize *= 3;
            triangleBuffer[whichSet].numItems = triBufferSize;

        } // end for each triangle set 

    } // end if triangles found
} // end load triangles

// setup the webGL shaders
function setupShaders() {
    
    // define fragment shader in essl using es6 template strings
    var fShaderCode = `
        precision mediump float;

        uniform vec4 vAmbientColor;
        uniform vec4 vDiffuseColor;
        uniform vec4 vSpecularColor;

        varying vec3 vNormal;
        varying vec4 vPosition;

        uniform vec3 lightPos;
        uniform vec3 lightColor;
        uniform vec3 eyePos;
        uniform float specularExponent;
        uniform bool aPhong;

        void main(void) {
            vec3 lightDirection = normalize(lightPos - vPosition.xyz);
            vec3 eyeDirection = normalize( - vPosition.xyz);
            vec3 normal = normalize(vNormal);

            float directionalLightWeighting = max(dot(normal, lightDirection), 0.0);

            float specularLightWeighting = 0.0;
            if (aPhong) {
                vec3 reflectionDirection = reflect(-lightDirection, normal);
                specularLightWeighting = pow(max(dot(reflectionDirection, eyeDirection), 0.0), specularExponent);
            }
            else {
                vec3 halfvector = normalize(lightDirection + eyeDirection);
                specularLightWeighting = pow(max(dot(normal, halfvector), 0.0), specularExponent);
            }

            gl_FragColor = vec4(vAmbientColor.rgb * lightColor, vAmbientColor.a) + 
                        vec4(vDiffuseColor.rgb * lightColor * directionalLightWeighting, vDiffuseColor.a) + 
                        vec4(vSpecularColor.rgb * lightColor * specularLightWeighting, vSpecularColor.a);

        }
    `;
    
    // define vertex shader in essl using es6 template strings
    var vShaderCode = `
        attribute vec3 vertexPosition;
        attribute vec3 vertexNormal;

        varying vec3 vNormal;
        varying vec4 vPosition;

        uniform mat4 MVMatrix;
        uniform mat4 PMatrix;
        uniform mat3 NMatrix;

        void main(void) {
            vPosition = MVMatrix * vec4(vertexPosition, 1.0);
            gl_Position = PMatrix * vPosition;
            vNormal = NMatrix * vertexNormal;
        }
    `;
    
    try {
        // console.log("fragment shader: "+fShaderCode);
        var fShader = gl.createShader(gl.FRAGMENT_SHADER); // create frag shader
        gl.shaderSource(fShader,fShaderCode); // attach code to shader
        gl.compileShader(fShader); // compile the code for gpu execution

        // console.log("vertex shader: "+vShaderCode);
        var vShader = gl.createShader(gl.VERTEX_SHADER); // create vertex shader
        gl.shaderSource(vShader,vShaderCode); // attach code to shader
        gl.compileShader(vShader); // compile the code for gpu execution
            
        if (!gl.getShaderParameter(fShader, gl.COMPILE_STATUS)) { // bad frag shader compile
            throw "error during fragment shader compile: " + gl.getShaderInfoLog(fShader);  
            gl.deleteShader(fShader);
        } else if (!gl.getShaderParameter(vShader, gl.COMPILE_STATUS)) { // bad vertex shader compile
            throw "error during vertex shader compile: " + gl.getShaderInfoLog(vShader);  
            gl.deleteShader(vShader);
        } else { // no compile errors
            shaderProgram = gl.createProgram(); // create the single shader program
            gl.attachShader(shaderProgram, fShader); // put frag shader in program
            gl.attachShader(shaderProgram, vShader); // put vertex shader in program
            gl.linkProgram(shaderProgram); // link program into gl context

            if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) { // bad program link
                throw "error during shader program linking: " + gl.getProgramInfoLog(shaderProgram);
            } else { // no shader program link errors
                gl.useProgram(shaderProgram); // activate shader program (frag and vert)
                vertexPositionAttrib = gl.getAttribLocation(shaderProgram, "vertexPosition");
                gl.enableVertexAttribArray(vertexPositionAttrib); // input to shader from array

                vertexNormalAttrib = gl.getAttribLocation(shaderProgram, "vertexNormal");
                gl.enableVertexAttribArray(vertexNormalAttrib); // input to shader from array

                vertexDiffuseColorAttrib = gl.getUniformLocation(shaderProgram, "vDiffuseColor");
                vertexAmbientColorAttrib = gl.getUniformLocation(shaderProgram, "vAmbientColor");
                vertexSpecularColorAttrib = gl.getUniformLocation(shaderProgram, "vSpecularColor");

                shaderProgram.pmatrix = gl.getUniformLocation(shaderProgram, "PMatrix");
                shaderProgram.mvmatrix = gl.getUniformLocation(shaderProgram, "MVMatrix");
                shaderProgram.nmatrix = gl.getUniformLocation(shaderProgram, "NMatrix");
                shaderProgram.lightPos = gl.getUniformLocation(shaderProgram, "lightPos");
                shaderProgram.lightColor = gl.getUniformLocation(shaderProgram, "lightColor");
                shaderProgram.eyePos = gl.getUniformLocation(shaderProgram, "eyePos");
                shaderProgram.specular_exponent = gl.getUniformLocation(shaderProgram, "specularExponent");
                shaderProgram.phong = gl.getUniformLocation(shaderProgram, "aPhong");
            } // end if no shader program link errors
        } // end if no compile errors
    } // end try 
    
    catch(e) {
        console.log(e);
    } // end catch
} // end setup shaders

function renderStuff() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // clear frame/depth buffers
    renderTriangles();
    renderEllipsoids();
}

function setupLights(newmvmatrix, exp) {
    gl.uniform3f(shaderProgram.lightPos, LightPos[0], LightPos[1], LightPos[2]);
    gl.uniform3f(shaderProgram.lightColor, LightColor[0], LightColor[1], LightColor[2]);
    gl.uniform3f(shaderProgram.eyePos, Eye[0], Eye[1], Eye[2]);

    gl.uniformMatrix4fv(shaderProgram.pmatrix, false, pmatrix);
    gl.uniformMatrix4fv(shaderProgram.mvmatrix, false, newmvmatrix);
    var nmatrix = mat3.create();
    mat3.fromMat4(nmatrix, newmvmatrix);
    mat3.invert(nmatrix, nmatrix);
    mat3.transpose(nmatrix, nmatrix);
    gl.uniformMatrix3fv(shaderProgram.nmatrix, false, nmatrix);
    gl.uniform1f(shaderProgram.specular_exponent, exp);

    gl.uniform1f(shaderProgram.phong, phong);

}

// render the loaded model
function renderTriangles() {

    mat4.perspective(pmatrix, 90*Math.PI/180, gl.viewportWidth / gl.viewportHeight, 0.5, 2.0);
    mat4.lookAt(mvmatrix, Eye, Center, Up);
    // setupLights();

    for (var whichSet=0; whichSet<inputTriangles.length; whichSet++) {
        gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer[whichSet]); // activate
        gl.vertexAttribPointer(vertexPositionAttrib, vertexBuffer[whichSet].itemSize, gl.FLOAT, false, 0, 0); // feed

        gl.bindBuffer(gl.ARRAY_BUFFER,normalBuffer[whichSet]); // activate
        gl.vertexAttribPointer(vertexNormalAttrib, normalBuffer[whichSet].itemSize, gl.FLOAT, false, 0, 0); // feed

        var transform_matrix = mat4.create();
        var cent = triangle_centrois[whichSet];
        mat4.translate(transform_matrix, transform_matrix, cent);

        if (whichSet == highlight_triangle_index) {
            mat4.scale(transform_matrix, transform_matrix, [1.2, 1.2, 1.2]);
        }

        mat4.translate(transform_matrix, transform_matrix, triangle_translations[whichSet]);

        mat4.rotateX(transform_matrix, transform_matrix, transformTriangles[whichSet][0]);
        mat4.rotateY(transform_matrix, transform_matrix, transformTriangles[whichSet][1]);
        mat4.rotateZ(transform_matrix, transform_matrix, transformTriangles[whichSet][2]);

        var minus_cent = vec3.create();
        vec3.scale(minus_cent, cent, -1.0)
        mat4.translate(transform_matrix, transform_matrix, minus_cent);

        // mat4.translate(transform_matrix, transform_matrix, triangle_translations[whichSet]);

        mat4.multiply(transform_matrix, mvmatrix, transform_matrix);
        setupLights(transform_matrix, 1.0);

        // setup ambient, diffuse and specular light components 
        var material = inputTriangles[whichSet].material;
        gl.uniform4f(vertexAmbientColorAttrib, material.ambient[0], material.ambient[1], material.ambient[2], 1.0);
        gl.uniform4f(vertexDiffuseColorAttrib, material.diffuse[0], material.diffuse[1], material.diffuse[2], 1.0);
        gl.uniform4f(vertexSpecularColorAttrib, material.specular[0], material.specular[1], material.specular[2], 1.0);

        // triangle buffer: activate and render
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,triangleBuffer[whichSet]); // activate
        gl.drawElements(gl.TRIANGLES,triangleBuffer[whichSet].numItems,gl.UNSIGNED_SHORT,0); // render
    }

    // vertex buffer: activate and feed into vertex shader
    
} // end render triangles

function renderEllipsoids() {
    // vertex buffer: activate and feed into vertex shader
    for (var whichSet=0; whichSet<inputEllipsoids.length; whichSet++) {
        gl.bindBuffer(gl.ARRAY_BUFFER, ellipsoidsVertexPositionBuffer[whichSet]); // activate
        gl.vertexAttribPointer(vertexPositionAttrib, ellipsoidsVertexPositionBuffer[whichSet].itemSize, gl.FLOAT, false, 0, 0); // feed

        gl.bindBuffer(gl.ARRAY_BUFFER, ellipsoidsNormalBuffer[whichSet]); // activate
        gl.vertexAttribPointer(vertexNormalAttrib, ellipsoidsNormalBuffer[whichSet].itemSize, gl.FLOAT, false, 0, 0); // feed

        // ellipsoid buffer: activate and render
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ellipsiodsVertexIndexBuffer[whichSet]); // activate

        var transform_matrix = mat4.create();
        var cent = [inputEllipsoids[whichSet].x, inputEllipsoids[whichSet].y, inputEllipsoids[whichSet].z];
        mat4.translate(transform_matrix, transform_matrix, cent);
        if (whichSet == highlight_ellipsoid_index) {
            mat4.scale(transform_matrix, transform_matrix, [1.2, 1.2, 1.2]);
        }

        mat4.translate(transform_matrix, transform_matrix, ellipsoid_translations[whichSet]);

        mat4.rotateX(transform_matrix, transform_matrix, transformEllipsoids[whichSet][0]);
        mat4.rotateY(transform_matrix, transform_matrix, transformEllipsoids[whichSet][1]);
        mat4.rotateZ(transform_matrix, transform_matrix, transformEllipsoids[whichSet][2]);

        var minus_cent = vec3.create();
        vec3.scale(minus_cent, cent, -1.0)

        mat4.translate(transform_matrix, transform_matrix, minus_cent);

        mat4.multiply(transform_matrix, mvmatrix, transform_matrix);
        setupLights(transform_matrix, inputEllipsoids[whichSet].n);

        var material = inputEllipsoids[whichSet];
        gl.uniform4f(vertexAmbientColorAttrib, material.ambient[0], material.ambient[1], material.ambient[2], 1.0);
        gl.uniform4f(vertexDiffuseColorAttrib, material.diffuse[0], material.diffuse[1], material.diffuse[2], 1.0);
        gl.uniform4f(vertexSpecularColorAttrib, material.specular[0], material.specular[1], material.specular[2], 1.0);

        gl.drawElements(gl.TRIANGLES,ellipsiodsVertexIndexBuffer[whichSet].numItems,gl.UNSIGNED_SHORT,0); // render
    }
}


/* MAIN -- HERE is where execution begins after window load */

function main() {
  
  setupWebGL(); // set up the webGL environment
  loadTriangles(); // load in the triangles from tri file
  loadEllipsoids(); // load in the ellipsoids from ellipsoids file
  setupShaders(); // setup the webGL shaders
  document.onkeypress = keyboard;
  document.onkeydown = keyboard2;
  renderStuff();
  
} // end main
