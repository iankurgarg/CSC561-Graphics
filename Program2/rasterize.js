/* GLOBAL CONSTANTS AND VARIABLES */

/* assignment specific globals */
const WIN_Z = 0;  // default graphics window z coord in world space
const WIN_LEFT = 0; const WIN_RIGHT = 1;  // default left and right x coords in world space
const WIN_BOTTOM = 0; const WIN_TOP = 1;  // default top and bottom y coords in world space
const INPUT_TRIANGLES_URL = "https://iankurgarg.github.io/Graphics/Program2/data/triangles.json"; // triangles file loc
const INPUT_SPHERES_URL = "https://iankurgarg.github.io/Graphics/Program2/data/ellipsoids.json"; // ellipsoids file loc
var Eye = new vec4.fromValues(0.5,0.5,-0.5,1.0); // default eye position in world space

/* webgl globals */
var gl = null; // the all powerful gl object. It's all here folks!
var shaderProgram;
var mvmatrix = mat4.create();   //ModelView Transformation Matrix
var pmatrix = mat4.create();    //Projection Matrix

var ambientColorBuffer; // this contains vertex colors in triples
var diffuseColorBuffer; // this contains vertex colors in triples
var specularColorBuffer; // this contains vertex colors in triples
var vertexBuffer; // this contains vertex coordinates in triples
var normalBuffer;
var triangleBuffer; // this contains indices into vertexBuffer in triples
var inputTriangles;

//Buffers for ellipsoids
var inputEllipsoids;
var ellipsoidsNormalBuffer;
var ellipsoidsAmbientColorBuffer;
var ellipsoidsDiffuseColorBuffer;
var ellipsoidsSpecularColorBuffer;
var ellipsoidsVertexPositionBuffer;
var ellipsiodsVertexIndexBuffer;

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
// var At = [0, 0, 1];
var Center = [0.5, 0.5, 1];

var highlight_ellipsoid_index = -1;
var highlight_triangle_index = -1;


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
        var indexOffset = 0;
        var vertexPositionData = [];
        var normalData = [];
        var ambientColorData = [];
        var diffuseColorData = [];
        var specularColorData = [];
        var indexData = [];
        for (var i = 0; i < inputEllipsoids.length; i++) {
            var scale_arg = 1.0;
            if (i == highlight_ellipsoid_index){
                scale_arg = 1.20;
            }
            var ambient = inputEllipsoids[i].ambient;
            var diffuse = inputEllipsoids[i].diffuse;
            var specular = inputEllipsoids[i].specular;

            var latitudeBands = 30;
            var longitudeBands = 30;
            var radius = [inputEllipsoids[i].a, inputEllipsoids[i].b, inputEllipsoids[i].c];
            // alert(radius);
            // var radius = [2,2,2];
            var center = [inputEllipsoids[i].x, inputEllipsoids[i].y, inputEllipsoids[i].z];
            
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
                    var u = 1 - (longNumber / longitudeBands);
                    var v = 1 - (latNumber / latitudeBands);

                    normalData.push(x, y, z);
                    vertexPositionData.push((radius[0] * x * scale_arg) + center[0]);
                    vertexPositionData.push((radius[1] * y * scale_arg) + center[1]);
                    vertexPositionData.push((radius[2] * z * scale_arg) + center[2]);

                    ambientColorData.push(ambient[0], ambient[1], ambient[2], 1.0);
                    diffuseColorData.push(diffuse[0], diffuse[1], diffuse[2], 1.0);
                    specularColorData.push(specular[0], specular[1], specular[2], inputEllipsoids[i].n);
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
            indexOffset = vertexPositionData.length/3;
        }

        ellipsoidsNormalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, ellipsoidsNormalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalData), gl.STATIC_DRAW);
        ellipsoidsNormalBuffer.itemSize = 3;
        ellipsoidsNormalBuffer.numItems = normalData.length / 3;

        ellipsoidsVertexPositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, ellipsoidsVertexPositionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPositionData), gl.STATIC_DRAW);
        ellipsoidsVertexPositionBuffer.itemSize = 3;
        ellipsoidsVertexPositionBuffer.numItems = vertexPositionData.length / 3;

        ellipsoidsAmbientColorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, ellipsoidsAmbientColorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ambientColorData), gl.STATIC_DRAW);
        ellipsoidsAmbientColorBuffer.itemSize = 4;
        ellipsoidsAmbientColorBuffer.numItems = vertexPositionData.length / 4;

        ellipsoidsDiffuseColorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, ellipsoidsDiffuseColorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(diffuseColorData), gl.STATIC_DRAW);
        ellipsoidsDiffuseColorBuffer.itemSize = 4;
        ellipsoidsDiffuseColorBuffer.numItems = vertexPositionData.length / 4;

        ellipsoidsSpecularColorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, ellipsoidsSpecularColorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(specularColorData), gl.STATIC_DRAW);
        ellipsoidsSpecularColorBuffer.itemSize = 4;
        ellipsoidsSpecularColorBuffer.numItems = vertexPositionData.length / 4;

        ellipsiodsVertexIndexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ellipsiodsVertexIndexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexData), gl.STATIC_DRAW);
        ellipsiodsVertexIndexBuffer.itemSize = 1;
        ellipsiodsVertexIndexBuffer.numItems = indexData.length;

    }
}

// read triangles in, load them into webgl buffers
function loadTriangles() {
    inputTriangles = getJSONFile(INPUT_TRIANGLES_URL,"triangles");

    if (inputTriangles != String.null) { 
        var whichSetVert; // index of vertex in current triangle set
        var whichSetTri; // index of triangle in current triangle set
        var coordArray = []; // 1D array of vertex coords for WebGL
        var indexArray = []; // 1D array of vertex indices for WebGL
        var vtxBufferSize = 0; // the number of vertices in the vertex buffer
        var vtxToAdd = []; // vtx coords to add to the coord array
        var indexOffset = vec3.create(); // the index offset for the current set
        var triToAdd = vec3.create(); // tri indices to add to the index array
        var ambientColorArray = []; // store the colors of the vertices
        var diffuseColorArray = []; // store the colors of the vertices
        var specularColorArray = []; // store the colors of the vertices
        var normalData = [];
        var col = vec3.create();
        triBufferSize = 0;

        
        for (var whichSet=0; whichSet<inputTriangles.length; whichSet++) {
            var ambient = inputTriangles[whichSet].material.ambient;
            var diffuse = inputTriangles[whichSet].material.diffuse;
            var specular = inputTriangles[whichSet].material.specular;
            var normals = inputTriangles[whichSet].normals;

            vec3.set(indexOffset,vtxBufferSize,vtxBufferSize,vtxBufferSize); // update vertex offset
            var scale_arg = 1.0;
            if (highlight_triangle_index == whichSet) {
                scale_arg = 1.2;
            }
            
            // set up the vertex coord array
            for (whichSetVert=0; whichSetVert<inputTriangles[whichSet].vertices.length; whichSetVert++) {
                vtxToAdd = inputTriangles[whichSet].vertices[whichSetVert];
                coordArray.push(vtxToAdd[0],vtxToAdd[1],vtxToAdd[2]);
                normalData.push(normals[whichSetVert][0], normals[whichSetVert][1], normals[whichSetVert][2]);
                diffuseColorArray.push(diffuse[0], diffuse[1], diffuse[2], 1.0);
                ambientColorArray.push(ambient[0], ambient[1], ambient[2], 1.0);
                specularColorArray.push(specular[0], specular[1], specular[2], 1.0);
            } // end for vertices in set
            
            // set up the triangle index array, adjusting indices across sets
            for (whichSetTri=0; whichSetTri<inputTriangles[whichSet].triangles.length; whichSetTri++) {
                vec3.add(triToAdd,indexOffset,inputTriangles[whichSet].triangles[whichSetTri]);
                indexArray.push(triToAdd[0],triToAdd[1],triToAdd[2]);
            } // end for triangles in set

            vtxBufferSize += inputTriangles[whichSet].vertices.length; // total number of vertices
            triBufferSize += inputTriangles[whichSet].triangles.length; // total number of tris
        } // end for each triangle set 
        triBufferSize *= 3; // now total number of indices

        // console.log("coordinates: "+coordArray.toString());
        // console.log("numverts: "+vtxBufferSize);
        // console.log("indices: "+indexArray.toString());
        // console.log("numindices: "+triBufferSize);
        
        // send the vertex coords to webGL
        vertexBuffer = gl.createBuffer(); // init empty vertex coord buffer
        gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer); // activate that buffer
        gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(coordArray),gl.STATIC_DRAW); // coords to that buffer
        vertexBuffer.itemSize = 3;

        normalBuffer = gl.createBuffer(); // init empty vertex coord buffer
        gl.bindBuffer(gl.ARRAY_BUFFER,normalBuffer); // activate that buffer
        gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(normalData),gl.STATIC_DRAW); // coords to that buffer
        normalBuffer.itemSize = 3;

        // send the vertex colors to webGL
        ambientColorBuffer = gl.createBuffer(); // init empty vertex color buffer
        gl.bindBuffer(gl.ARRAY_BUFFER,ambientColorBuffer); // activate that buffer
        gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(ambientColorArray),gl.STATIC_DRAW); // coords to that buffer
        ambientColorBuffer.itemSize = 4;

        diffuseColorBuffer = gl.createBuffer(); // init empty vertex color buffer
        gl.bindBuffer(gl.ARRAY_BUFFER,diffuseColorBuffer); // activate that buffer
        gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(diffuseColorArray),gl.STATIC_DRAW); // coords to that buffer
        diffuseColorBuffer.itemSize = 4;

        specularColorBuffer = gl.createBuffer(); // init empty vertex color buffer
        gl.bindBuffer(gl.ARRAY_BUFFER,specularColorBuffer); // activate that buffer
        gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(specularColorArray),gl.STATIC_DRAW); // coords to that buffer
        specularColorBuffer.itemSize = 4;
        
        // send the triangle indices to webGL
        triangleBuffer = gl.createBuffer(); // init empty triangle index buffer
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, triangleBuffer); // activate that buffer
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(indexArray),gl.STATIC_DRAW); // indices to that buffer

    } // end if triangles found
} // end load triangles

// setup the webGL shaders
function setupShaders() {
    
    // define fragment shader in essl using es6 template strings
    var fShaderCode = `
        precision mediump float;

        varying vec4 vAmbientColor;
        varying vec4 vDiffuseColor;
        varying vec4 vSpecularColor;
        varying vec3 vNormal;
        varying vec4 vPosition;

        uniform vec3 lightPos;
        uniform vec3 lightColor;
        uniform vec3 eyePos;

        void main(void) {
            vec3 lightDirection = normalize(lightPos - vPosition.xyz);
            
            vec3 normal = normalize(vNormal);
            vec3 eyeDirection = normalize(eyePos - vPosition.xyz);
            vec3 reflectionDirection = normalize(reflect(-lightDirection, normal));

            float specularLightWeighting = pow(max(dot(reflectionDirection, eyeDirection), 0.0), vSpecularColor.a);
            //vSpecularColor.a using this as a hack to store n value related to specular color

            float directionalLightWeighting = max(dot(normal, lightDirection), 0.0);

            gl_FragColor = vec4(vAmbientColor.rgb * lightColor, vAmbientColor.a) + 
                        vec4(vDiffuseColor.rgb * lightColor * directionalLightWeighting, vDiffuseColor.a) + 
                        vec4(vSpecularColor.rgb * lightColor * specularLightWeighting, 1.0);

        }
    `;
    
    // define vertex shader in essl using es6 template strings
    var vShaderCode = `
        attribute vec3 vertexPosition;
        attribute vec4 aVertexDiffuseColor;
        attribute vec4 aVertexAmbientColor;
        attribute vec4 aVertexSpecularColor;
        attribute vec3 vertexNormal;

        varying vec4 vAmbientColor;
        varying vec4 vDiffuseColor;
        varying vec4 vSpecularColor;
        varying vec3 vNormal;
        varying vec4 vPosition;

        uniform mat4 MVMatrix;
        uniform mat4 PMatrix;
        uniform mat3 NMatrix;

        void main(void) {
            vPosition = MVMatrix * vec4(vertexPosition, 1.0); // use the untransformed position;
            gl_Position = PMatrix * vPosition;
            vAmbientColor = aVertexAmbientColor;
            vDiffuseColor = aVertexDiffuseColor;
            vSpecularColor = aVertexSpecularColor;
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

                vertexDiffuseColorAttrib = gl.getAttribLocation(shaderProgram, "aVertexDiffuseColor");
                gl.enableVertexAttribArray(vertexDiffuseColorAttrib); // input to shader from array

                vertexAmbientColorAttrib = gl.getAttribLocation(shaderProgram, "aVertexAmbientColor");
                gl.enableVertexAttribArray(vertexAmbientColorAttrib); // input to shader from array

                vertexSpecularColorAttrib = gl.getAttribLocation(shaderProgram, "aVertexSpecularColor");
                gl.enableVertexAttribArray(vertexSpecularColorAttrib); // input to shader from array

                shaderProgram.pmatrix = gl.getUniformLocation(shaderProgram, "PMatrix");
                shaderProgram.mvmatrix = gl.getUniformLocation(shaderProgram, "MVMatrix");
                shaderProgram.nmatrix = gl.getUniformLocation(shaderProgram, "NMatrix");
                shaderProgram.lightPos = gl.getUniformLocation(shaderProgram, "lightPos");
                shaderProgram.lightColor = gl.getUniformLocation(shaderProgram, "lightColor");
                shaderProgram.eyePos = gl.getUniformLocation(shaderProgram, "eyePos");
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

function setupLights() {
    gl.uniform3f(shaderProgram.lightPos, LightPos[0], LightPos[1], LightPos[2]);
    gl.uniform3f(shaderProgram.lightColor, LightColor[0], LightColor[1], LightColor[2]);
    gl.uniform3f(shaderProgram.eyePos, Eye[0], Eye[1], Eye[2]);

    gl.uniformMatrix4fv(shaderProgram.pmatrix, false, pmatrix);
    gl.uniformMatrix4fv(shaderProgram.mvmatrix, false, mvmatrix);
    var nmatrix = mat3.create();
    mat3.fromMat4(nmatrix, mvmatrix);
    mat3.invert(nmatrix, nmatrix);
    mat3.transpose(nmatrix, nmatrix);
    gl.uniformMatrix3fv(shaderProgram.nmatrix, false, nmatrix);

}

// render the loaded model
function renderTriangles() {

    mat4.perspective(pmatrix, 90*Math.PI/180, gl.viewportWidth / gl.viewportHeight, 0.5, 2.0);
    mat4.lookAt(mvmatrix, Eye, Center, Up);

    // vertex buffer: activate and feed into vertex shader
    gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer); // activate
    gl.vertexAttribPointer(vertexPositionAttrib, vertexBuffer.itemSize, gl.FLOAT, false, 0, 0); // feed

    gl.bindBuffer(gl.ARRAY_BUFFER,normalBuffer); // activate
    gl.vertexAttribPointer(vertexNormalAttrib, normalBuffer.itemSize, gl.FLOAT, false, 0, 0); // feed

    // vertex color buffer: activate and feed into vertex shader
    gl.bindBuffer(gl.ARRAY_BUFFER,ambientColorBuffer); // activate
    gl.vertexAttribPointer(vertexAmbientColorAttrib, ambientColorBuffer.itemSize, gl.FLOAT, false, 0, 0); // feed

    gl.bindBuffer(gl.ARRAY_BUFFER,diffuseColorBuffer); // activate
    gl.vertexAttribPointer(vertexDiffuseColorAttrib, diffuseColorBuffer.itemSize, gl.FLOAT, false, 0, 0); // feed

    gl.bindBuffer(gl.ARRAY_BUFFER,specularColorBuffer); // activate
    gl.vertexAttribPointer(vertexSpecularColorAttrib, specularColorBuffer.itemSize, gl.FLOAT, false, 0, 0); // feed

    // triangle buffer: activate and render
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,triangleBuffer); // activate
    setupLights();
    gl.drawElements(gl.TRIANGLES,triBufferSize,gl.UNSIGNED_SHORT,0); // render
} // end render triangles

function renderEllipsoids() {
    // vertex buffer: activate and feed into vertex shader
    gl.bindBuffer(gl.ARRAY_BUFFER, ellipsoidsVertexPositionBuffer); // activate
    gl.vertexAttribPointer(vertexPositionAttrib, ellipsoidsVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0); // feed

    gl.bindBuffer(gl.ARRAY_BUFFER, ellipsoidsNormalBuffer); // activate
    gl.vertexAttribPointer(vertexNormalAttrib, ellipsoidsNormalBuffer.itemSize, gl.FLOAT, false, 0, 0); // feed

    // vertex color buffer: activate and feed into vertex shader
    gl.bindBuffer(gl.ARRAY_BUFFER,ellipsoidsDiffuseColorBuffer); // activate
    gl.vertexAttribPointer(vertexDiffuseColorAttrib, ellipsoidsDiffuseColorBuffer.itemSize, gl.FLOAT, false, 0, 0); // feed

    gl.bindBuffer(gl.ARRAY_BUFFER,ellipsoidsAmbientColorBuffer); // activate
    gl.vertexAttribPointer(vertexAmbientColorAttrib, ellipsoidsAmbientColorBuffer.itemSize, gl.FLOAT, false, 0, 0); // feed

    gl.bindBuffer(gl.ARRAY_BUFFER,ellipsoidsSpecularColorBuffer); // activate
    gl.vertexAttribPointer(vertexSpecularColorAttrib, ellipsoidsSpecularColorBuffer.itemSize, gl.FLOAT, false, 0, 0); // feed

    // ellipsoid buffer: activate and render
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ellipsiodsVertexIndexBuffer); // activate
    setupLights();
    gl.drawElements(gl.TRIANGLES,ellipsiodsVertexIndexBuffer.numItems,gl.UNSIGNED_SHORT,0); // render
}


/* MAIN -- HERE is where execution begins after window load */

function main() {
  
  setupWebGL(); // set up the webGL environment
  loadTriangles(); // load in the triangles from tri file
  loadEllipsoids(); // load in the ellipsoids from ellipsoids file
  setupShaders(); // setup the webGL shaders
  document.onkeypress = keyboard;
  document.onkeydown = keyboard;
  renderStuff();
  
} // end main
