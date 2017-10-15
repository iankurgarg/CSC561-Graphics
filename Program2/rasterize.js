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
var colotBuffer; // this contains vertex colors in triples
var vertexBuffer; // this contains vertex coordinates in triples
var triangleBuffer; // this contains indices into vertexBuffer in triples

//Buffers for ellipsoids
var ellipsoidsNormalBuffer;
var ellipsoidsVertexColorBuffer;
var ellipsoidsVertexTextureCoordBuffer;
var ellipsoidsVertexPositionBuffer;
var ellipsiodsVertexIndexBuffer;

var triBufferSize = 0; // the number of indices in the triangle buffer

var vertexPositionAttrib; // where to put position for vertex shader
var vertexColorAttrib; // where to put color for vertex shader


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
    var inputEllipsoids = getJSONFile(INPUT_SPHERES_URL, "spheres");
    
    if (inputEllipsoids != null) {
        var indexOffset = 0;
        var vertexPositionData = [];
        var normalData = [];
        var textureCoordData = [];
        var colorData = [];
        var indexData = [];
        for (var i = 0; i < inputEllipsoids.length; i++) {
            var ambient = inputEllipsoids[i].ambient;
            var diffuse = inputEllipsoids[i].diffuse;
            var specular = inputEllipsoids[i].specular;

            var latitudeBands = 30;
            var longitudeBands = 30;
            var radius = [inputEllipsoids[i].a, inputEllipsoids[i].b, inputEllipsoids[i].c];
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

                    normalData.push(x);
                    normalData.push(y);
                    normalData.push(z);
                    textureCoordData.push(u);
                    textureCoordData.push(v);
                    vertexPositionData.push((radius[0] * x) + center[0]);
                    vertexPositionData.push((radius[1] * y) + center[1]);
                    vertexPositionData.push((radius[2] * z) + center[2]);

                    colorData.push(diffuse[0]);
                    colorData.push(diffuse[1]);
                    colorData.push(diffuse[2]);
                    colorData.push(1.0);
                }
            }

            for (var latNumber=0; latNumber < latitudeBands; latNumber++) {
                for (var longNumber=0; longNumber < longitudeBands; longNumber++) {
                    var first = (latNumber * (longitudeBands + 1)) + longNumber + indexOffset;
                    var second = first + longitudeBands + 1;
                    indexData.push(first);
                    indexData.push(second);
                    indexData.push(first + 1);

                    indexData.push(second);
                    indexData.push(second + 1);
                    indexData.push(first + 1);
                }
            }
            indexOffset = vertexPositionData.length/3;
        }

        ellipsoidsNormalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, ellipsoidsNormalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalData), gl.STATIC_DRAW);
        ellipsoidsNormalBuffer.itemSize = 3;
        ellipsoidsNormalBuffer.numItems = normalData.length / 3;

        // ellipsoidsVertexTextureCoordBuffer = gl.createBuffer();
        // gl.bindBuffer(gl.ARRAY_BUFFER, ellipsoidsVertexTextureCoordBuffer);
        // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordData), gl.STATIC_DRAW);
        // ellipsoidsVertexTextureCoordBuffer.itemSize = 2;
        // ellipsoidsVertexTextureCoordBuffer.numItems = textureCoordData.length / 2;

        ellipsoidsVertexPositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, ellipsoidsVertexPositionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPositionData), gl.STATIC_DRAW);
        ellipsoidsVertexPositionBuffer.itemSize = 3;
        ellipsoidsVertexPositionBuffer.numItems = vertexPositionData.length / 3;

        ellipsoidsVertexColorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, ellipsoidsVertexColorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorData), gl.STATIC_DRAW);
        ellipsoidsVertexColorBuffer.itemSize = 4;
        ellipsoidsVertexColorBuffer.numItems = vertexPositionData.length / 4;

        ellipsiodsVertexIndexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ellipsiodsVertexIndexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexData), gl.STATIC_DRAW);
        ellipsiodsVertexIndexBuffer.itemSize = 1;
        ellipsiodsVertexIndexBuffer.numItems = indexData.length;

    }
}

// read triangles in, load them into webgl buffers
function loadTriangles() {
    var inputTriangles = getJSONFile(INPUT_TRIANGLES_URL,"triangles");

    if (inputTriangles != String.null) { 
        var whichSetVert; // index of vertex in current triangle set
        var whichSetTri; // index of triangle in current triangle set
        var coordArray = []; // 1D array of vertex coords for WebGL
        var indexArray = []; // 1D array of vertex indices for WebGL
        var vtxBufferSize = 0; // the number of vertices in the vertex buffer
        var vtxToAdd = []; // vtx coords to add to the coord array
        var indexOffset = vec3.create(); // the index offset for the current set
        var triToAdd = vec3.create(); // tri indices to add to the index array
        var colorArray = []; // store the colors of the vertices
        var col = vec3.create();
        
        for (var whichSet=0; whichSet<inputTriangles.length; whichSet++) {
            var ambient = inputTriangles[whichSet].material.ambient;
            var diffuse = inputTriangles[whichSet].material.diffuse;
            var specular = inputTriangles[whichSet].material.specular;

            vec3.set(indexOffset,vtxBufferSize,vtxBufferSize,vtxBufferSize); // update vertex offset
            
            // set up the vertex coord array
            for (whichSetVert=0; whichSetVert<inputTriangles[whichSet].vertices.length; whichSetVert++) {
                vtxToAdd = inputTriangles[whichSet].vertices[whichSetVert];
                coordArray.push(vtxToAdd[0],vtxToAdd[1],vtxToAdd[2]);
                colorArray.push(diffuse[0], diffuse[1], diffuse[2], 1.0);
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

        // send the vertex colors to webGL
        colorBuffer = gl.createBuffer(); // init empty vertex color buffer
        gl.bindBuffer(gl.ARRAY_BUFFER,colorBuffer); // activate that buffer
        gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(colorArray),gl.STATIC_DRAW); // coords to that buffer
        colorBuffer.itemSize = 4;
        
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

        varying vec4 vColor;
        void main(void) {
            // gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0); // all fragments are white
            gl_FragColor = vColor;
        }
    `;
    
    // define vertex shader in essl using es6 template strings
    var vShaderCode = `
        attribute vec3 vertexPosition;
        attribute vec4 aVertexColor;
        varying vec4 vColor;

        void main(void) {
            gl_Position = vec4(vertexPosition, 1.0); // use the untransformed position
            vColor = aVertexColor;
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
            var shaderProgram = gl.createProgram(); // create the single shader program
            gl.attachShader(shaderProgram, fShader); // put frag shader in program
            gl.attachShader(shaderProgram, vShader); // put vertex shader in program
            gl.linkProgram(shaderProgram); // link program into gl context

            if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) { // bad program link
                throw "error during shader program linking: " + gl.getProgramInfoLog(shaderProgram);
            } else { // no shader program link errors
                gl.useProgram(shaderProgram); // activate shader program (frag and vert)
                vertexPositionAttrib = // get pointer to vertex shader input
                    gl.getAttribLocation(shaderProgram, "vertexPosition");
                gl.enableVertexAttribArray(vertexPositionAttrib); // input to shader from array
                vertexColorAttrib = // get pointer to vertex shader input
                    gl.getAttribLocation(shaderProgram, "aVertexColor");
                gl.enableVertexAttribArray(vertexColorAttrib); // input to shader from array
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

// render the loaded model
function renderTriangles() {
    // vertex buffer: activate and feed into vertex shader
    gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer); // activate
    gl.vertexAttribPointer(vertexPositionAttrib, vertexBuffer.itemSize, gl.FLOAT, false, 0, 0); // feed

    // vertex color buffer: activate and feed into vertex shader
    gl.bindBuffer(gl.ARRAY_BUFFER,colorBuffer); // activate
    gl.vertexAttribPointer(vertexColorAttrib, colorBuffer.itemSize, gl.FLOAT, false, 0, 0); // feed

    // triangle buffer: activate and render
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,triangleBuffer); // activate
    gl.drawElements(gl.TRIANGLES,triBufferSize,gl.UNSIGNED_SHORT,0); // render
} // end render triangles

function renderEllipsoids() {
    // vertex buffer: activate and feed into vertex shader
    gl.bindBuffer(gl.ARRAY_BUFFER, ellipsoidsVertexPositionBuffer); // activate
    gl.vertexAttribPointer(vertexPositionAttrib, ellipsoidsVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0); // feed

    // vertex color buffer: activate and feed into vertex shader
    gl.bindBuffer(gl.ARRAY_BUFFER,ellipsoidsVertexColorBuffer); // activate
    gl.vertexAttribPointer(vertexColorAttrib, ellipsoidsVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0); // feed

    // triangle buffer: activate and render
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ellipsiodsVertexIndexBuffer); // activate
    gl.drawElements(gl.TRIANGLES,ellipsiodsVertexIndexBuffer.numItems,gl.UNSIGNED_SHORT,0); // render
}


/* MAIN -- HERE is where execution begins after window load */

function main() {
  
  setupWebGL(); // set up the webGL environment
  loadTriangles(); // load in the triangles from tri file
  loadEllipsoids(); // load in the ellipsoids from ellipsoids file
  setupShaders(); // setup the webGL shaders
  renderStuff();
  
} // end main
