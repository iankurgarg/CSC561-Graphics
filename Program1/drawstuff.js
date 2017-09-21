/* classes */ 

// Color constructor
class Color {
    constructor(r,g,b,a=255) {
        try {
            if ((typeof(r) !== "number") || (typeof(g) !== "number") || (typeof(b) !== "number") || (typeof(a) !== "number"))
                throw "color component not a number";
            else if ((r<0) || (g<0) || (b<0) || (a<0)) 
                throw "color component less than 0";
            else if ((r>255) || (g>255) || (b>255) || (a>255)) 
                throw "color component bigger than 255";
            else {
                this.r = r; this.g = g; this.b = b; this.a = a; 
            }
        } // end try
        
        catch (e) {
            console.log(e);
        }
    } // end Color constructor

        // Color change method
    change(r,g,b,a) {
        try {
            if ((typeof(r) !== "number") || (typeof(g) !== "number") || (typeof(b) !== "number") || (typeof(a) !== "number"))
                throw "color component not a number";
            else if ((r<0) || (g<0) || (b<0) || (a<0)) 
                throw "color component less than 0";
            else if ((r>255) || (g>255) || (b>255) || (a>255)) 
                throw "color component bigger than 255";
            else {
                this.r = r; this.g = g; this.b = b; this.a = a; 
            }
        } // end throw
        
        catch (e) {
            console.log(e);
        }
    } // end Color change method

    add(r,g,b,a=0) {
        try {
            if ((typeof(r) !== "number") || (typeof(g) !== "number") || (typeof(b) !== "number") || (typeof(a) !== "number"))
                throw "color component not a number";
            else if ((r<0) || (g<0) || (b<0) || (a<0)) 
                throw "color component less than 0";
            else if ((r>255) || (g>255) || (b>255) || (a>255)) 
                throw "color component bigger than 255";
            else {
                this.r += r; this.g += g; this.b += b; this.a += a; 
            }
        } // end throw
        
        catch (e) {
            console.log(e);
        }
    }
} // end color class

class Triangle {
	constructor(v0, v1, v2) {
		this.set(v0, v1, v2);
	}
	set(v0, v1, v2) {
		try {
			this.v0 = v0; this.v1 = v1; this.v2 = v2;
		}
		catch(e){
			console.log(e);
		}
	}
	toConsole(prefix) {
        console.log(this.v0.toString("v0") + this.v1.toString("v1") + this.v2.toString("v2"));
    } // end to console
}

// Vector class
class Vector { 
    constructor(x=0,y=0,z=0) {
        this.set(x,y,z);
    } // end constructor
    
    // sets the components of a vector
    set(x,y,z) {
        try {
            if ((typeof(x) !== "number") || (typeof(y) !== "number") || (typeof(z) !== "number"))
                throw "vector component not a number";
            else
                this.x = x; this.y = y; this.z = z; 
        } // end try
        
        catch(e) {
            console.log(e);
        }
    } // end vector set
    
    // copy the passed vector into this one
    copy(v) {
        try {
            if (!(v instanceof Vector))
                throw "Vector.copy: non-vector parameter";
            else
                this.x = v.x; this.y = v.y; this.z = v.z;
        } // end try
        
        catch(e) {
            console.log(e);
        }
    }
    
    toConsole(prefix) {
        console.log(prefix+"["+this.x+","+this.y+","+this.z+"]");
    } // end to console

    toString(prefix="") {
        return (prefix+"["+this.x+","+this.y+","+this.z+"]");
    } // end to console
    
    // static dot method
    static dot(v1,v2) {
        try {
            if (!(v1 instanceof Vector) || !(v2 instanceof Vector))
                throw "Vector.dot: non-vector parameter";
            else
                return(v1.x*v2.x + v1.y*v2.y + v1.z*v2.z);
        } // end try
        
        catch(e) {
            console.log(e);
            return(NaN);
        }
    } // end dot static method

    // static cross method
    static cross(v1,v2) {
        try {
            if (!(v1 instanceof Vector) || !(v2 instanceof Vector))
                throw "Vector.cross: non-vector parameter";
            else {
            	var x1 = (v1.y*v2.z) - (v1.z*v2.y);
            	var y1 = (v1.z*v2.x) - (v1.x*v2.z);
            	var z1 = (v1.x*v2.y) - (v1.y*v2.x);
            	return (new Vector(x1, y1, z1));
            }
        } // end try
        
        catch(e) {
            console.log(e);
            return(NaN);
        }
    } // end cross static method

    // static add method
    static add(v1,v2) {
        try {
            if (!(v1 instanceof Vector) || !(v2 instanceof Vector))
                throw "Vector.add: non-vector parameter";
            else
                return(new Vector(v1.x+v2.x,v1.y+v2.y,v1.z+v2.z));
        } // end try
        
        catch(e) {
            console.log(e);
            return(new Vector(NaN,NaN,NaN));
        }
    } // end add static method

    // static subtract method, v1-v2
    static subtract(v1,v2) {
        try {
            if (!(v1 instanceof Vector) || !(v2 instanceof Vector))
                throw "Vector.subtract: non-vector parameter";
            else {
                var v = new Vector(v1.x-v2.x,v1.y-v2.y,v1.z-v2.z);
                //v.toConsole("Vector.subtract: ");
                return(v);
            }
        } // end try
        
        catch(e) {
            console.log(e);
            return(new Vector(NaN,NaN,NaN));
        }
    } // end subtract static method

    static multiply(v1,v2) {
        try {
            if (!(v1 instanceof Vector) || !(v2 instanceof Vector))
                throw "Vector.multiply: non-vector parameter";
            else {
                var v = new Vector(v1.x*v2.x,v1.y*v2.y,v1.z*v2.z);
                //v.toConsole("Vector.multiply: ");
                return(v);
            }
        } // end try
        
        catch(e) {
            console.log(e);
            return(new Vector(NaN,NaN,NaN));
        }
    } // end multiply static method

    // static scale method
    static scale(c,v) {
        try {
            if (!(typeof(c) === "number") || !(v instanceof Vector))
                throw "Vector.scale: malformed parameter";
            else
                return(new Vector(c*v.x,c*v.y,c*v.z));
        } // end try
        
        catch(e) {
            console.log(e);
            return(new Vector(NaN,NaN,NaN));
        }
    } // end scale static method

    // static divide method, returns element wise v1/v2
    static divide(v1,v2) {
        try {
            if (!(v1 instanceof Vector) || !(v2 instanceof Vector))
                throw "Vector.divide: non-vector parameter";
            else {
                var v = new Vector(v1.x/v2.x,v1.y/v2.y,v1.z/v2.z);
                //v.toConsole("Vector.divide: ");
                return(v);
            }
        } // end try
        
        catch(e) {
            console.log(e);
            return(new Vector(NaN,NaN,NaN));
        }
    } // end divide static method
    
    // static normalize method
    static normalize(v) {
        try {
            if (!(v instanceof Vector))
                throw "Vector.normalize: parameter not a vector";
            else {
                var lenDenom = 1/Math.sqrt(Vector.dot(v,v));
                return(Vector.scale(lenDenom,v));
            }
        } // end try
        
        catch(e) {
            console.log(e);
            return(new Vector(NaN,NaN,NaN));
        }
    } // end scale static method
    
} // end Vector class


/* utility functions */

// draw a pixel at x,y using color
function drawPixel(imagedata,x,y,color) {
    try {
        if ((typeof(x) !== "number") || (typeof(y) !== "number"))
            throw "drawpixel location not a number";
        else if ((x<0) || (y<0) || (x>=imagedata.width) || (y>=imagedata.height))
            throw "drawpixel location outside of image";
        else if (color instanceof Color) {
            var pixelindex = (y*imagedata.width + x) * 4;
            imagedata.data[pixelindex] = color.r;
            imagedata.data[pixelindex+1] = color.g;
            imagedata.data[pixelindex+2] = color.b;
            imagedata.data[pixelindex+3] = color.a;
        } else 
            throw "drawpixel color is not a Color";
    } // end try
    
    catch(e) {
        console.log(e);
    }
} // end drawPixel
    
// draw random pixels
function drawRandPixels(context) {
    var c = new Color(0,0,0,0); // the color at the pixel: black
    var w = context.canvas.width;
    var h = context.canvas.height;
    var imagedata = context.createImageData(w,h);
    const PIXEL_DENSITY = 0.01;
    var numPixels = (w*h)*PIXEL_DENSITY; 
    
    // Loop over 1% of the pixels in the image
    for (var x=0; x<numPixels; x++) {
        c.change(Math.random()*255,Math.random()*255,
            Math.random()*255,255); // rand color
        drawPixel(imagedata,
            Math.floor(Math.random()*w),
            Math.floor(Math.random()*h),
                c);
    } // end for x
    context.putImageData(imagedata, 0, 0);
} // end draw random pixels

// get the input ellipsoids from the standard class URL
function getInputEllipsoids(INPUT_ELLIPSOIDS_URL) {
    //const INPUT_ELLIPSOIDS_URL = "https://ncsucgclass.github.io/prog1/ellipsoids.json";
        
    // load the ellipsoids file
    var httpReq = new XMLHttpRequest(); // a new http request
    httpReq.open("GET",INPUT_ELLIPSOIDS_URL,false); // init the request
    httpReq.send(null); // send the request
    var startTime = Date.now();
    while ((httpReq.status !== 200) && (httpReq.readyState !== XMLHttpRequest.DONE)) {
        if ((Date.now()-startTime) > 3000)
            break;
    } // until its loaded or we time out after three seconds
    if ((httpReq.status !== 200) || (httpReq.readyState !== XMLHttpRequest.DONE)) {
        console.log*("Unable to open input ellipses file!");
        return String.null;
    } else
        return JSON.parse(httpReq.response); 
} // end get input ellipsoids

// put random points in the ellipsoids from the class github
function drawRandPixelsInInputEllipsoids(context) {
    var inputEllipsoids = getInputEllipsoids();
    var w = context.canvas.width;
    var h = context.canvas.height;
    var imagedata = context.createImageData(w,h);
    const PIXEL_DENSITY = 0.05;
    var numCanvasPixels = (w*h)*PIXEL_DENSITY; 
    
    if (inputEllipsoids != String.null) { 
        var x = 0; var y = 0; // pixel coord init
        var cx = 0; var cy = 0; // init center x and y coord
        var ellipsoidXRadius = 0; // init ellipsoid x radius
        var ellipsoidYRadius = 0; // init ellipsoid y radius
        var numEllipsoidPixels = 0; // init num pixels in ellipsoid
        var c = new Color(0,0,0,0); // init the ellipsoid color
        var n = inputEllipsoids.length; // the number of input ellipsoids
        //console.log("number of ellipses: " + n);

        // Loop over the ellipsoids, draw rand pixels in each
        for (var e=0; e<n; e++) {
            cx = w*inputEllipsoids[e].x; // ellipsoid center x
            cy = h*inputEllipsoids[e].y; // ellipsoid center y
            ellipsoidXRadius = Math.round(w*inputEllipsoids[e].a); // x radius
            ellipsoidYRadius = Math.round(h*inputEllipsoids[e].b); // y radius
            numEllipsoidPixels = inputEllipsoids[e].a*inputEllipsoids[e].b*Math.PI; // projected ellipsoid area
            numEllipsoidPixels *= PIXEL_DENSITY * w * h; // percentage of ellipsoid area to render to pixels
            numEllipsoidPixels = Math.round(numEllipsoidPixels);
            console.log("ellipsoid x radius: "+ellipsoidXRadius);
            console.log("ellipsoid y radius: "+ellipsoidYRadius);
            console.log("num ellipsoid pixels: "+numEllipsoidPixels);
            c.change(
                inputEllipsoids[e].diffuse[0]*255,
                inputEllipsoids[e].diffuse[1]*255,
                inputEllipsoids[e].diffuse[2]*255,
                255); // ellipsoid diffuse color
            for (var p=0; p<numEllipsoidPixels; p++) {
                do {
                    x = Math.random()*2 - 1; // in unit square 
                    y = Math.random()*2 - 1; // in unit square
                } while (Math.sqrt(x*x + y*y) > 1) // a circle is also an ellipse
                drawPixel(imagedata,
                    cx+Math.round(x*ellipsoidXRadius),
                    cy+Math.round(y*ellipsoidYRadius),c);
                //console.log("color: ("+c.r+","+c.g+","+c.b+")");
                //console.log("x: "+Math.round(w*inputEllipsoids[e].x));
                //console.log("y: "+Math.round(h*inputEllipsoids[e].y));
            } // end for pixels in ellipsoid
        } // end for ellipsoids
        context.putImageData(imagedata, 0, 0);
    } // end if ellipsoids found
} // end draw rand pixels in input ellipsoids

// draw 2d projections read from the JSON file at class github
function drawInputEllipsoidsUsingArcs(context) {
    var inputEllipsoids = getInputEllipsoids();
    
    
    if (inputEllipsoids != String.null) { 
        var c = new Color(0,0,0,0); // the color at the pixel: black
        var w = context.canvas.width;
        var h = context.canvas.height;
        var n = inputEllipsoids.length; 
        //console.log("number of ellipsoids: " + n);

        // Loop over the ellipsoids, draw each in 2d
        for (var e=0; e<n; e++) {
            context.fillStyle = 
                "rgb(" + Math.floor(inputEllipsoids[e].diffuse[0]*255)
                +","+ Math.floor(inputEllipsoids[e].diffuse[1]*255)
                +","+ Math.floor(inputEllipsoids[e].diffuse[2]*255) +")"; // diffuse color
            context.save(); // remember previous (non-) scale
            context.translate(w*inputEllipsoids[e].x,h*inputEllipsoids[e].y); // translate ellipsoid to ctr
            context.scale(1, inputEllipsoids[e].b/inputEllipsoids[e].a); // scale by ellipsoid ratio 
            context.beginPath();
            context.arc(0,0,Math.round(w*inputEllipsoids[e].a),0,2*Math.PI);
            context.restore(); // undo scale before fill so stroke width unscaled
            context.fill();
            //console.log(context.fillStyle);
            //console.log("x: "+Math.round(w*inputEllipsoids[e].x));
            //console.log("y: "+Math.round(h*inputEllipsoids[e].y));
            //console.log("a: "+Math.round(w*inputEllipsoids[e].a));
            //console.log("b: "+Math.round(h*inputEllipsoids[e].b));
        } // end for ellipsoids
    } // end if ellipsoids found
} // end draw input ellipsoids


// These Variables are udpated through the interface
var eye = new Vector(0.5, 0.5, -0.5);
var viewUp = new Vector(0,1,0);
var lookAt = new Vector(0,0,1);

// These are unchanged. If needed change here in code manually.
var distanceFromEye = 0.5;
var realW = 1.0;
var realH = 1.0;

// These are calculated and updated everytime above variables are changed

// Other Variables
var shadowsExtra = 1;
var trianglesExtra = 0;
var inputEllipsoids = getInputEllipsoids("https://ncsucgclass.github.io/prog1/ellipsoids.json");
var lights = getInputEllipsoids("https://ncsucgclass.github.io/prog1/lights.json");

function calculateNormalForEllipsoid(P, ellipse) {
	var C = new Vector(ellipse.x, ellipse.y, ellipse.z);
    var A = new Vector(ellipse.a, ellipse.b, ellipse.c);
    A2 = Vector.multiply(A, A);
    //A2 = Vector.scale(0.5, A2);
    var N = Vector.divide(Vector.subtract(P, C), A2);
    N = Vector.normalize(N);
    return N;
}

function calculateNormalForTriangle(triangle) {
	var v1 = Vector.subtract(triangle.v1, triangle.v0);
	var v2 = Vector.subtract(triangle.v2, triangle.v0);

	var N = Vector.cross(v1, v2);
	N = Vector.normalize(N);
	//N = Vector.scale(-1, N);
    return N;
}

function findIntersectionWithTriangle(E, D, triangle, screenT) {

	var N = calculateNormalForTriangle(triangle);
	
	var numerator = Vector.dot(N, Vector.subtract(triangle.v0, E));
	var denominator = Vector.dot(N, D);

	if (denominator == 0) {
		return null;
	}
	else {
		var t = numerator/denominator;
		if (t > screenT) {
			// check if point lies inside triangle;
			var P1 = Vector.add(E, Vector.scale(t, D));
			var u = Vector.subtract(triangle.v1, triangle.v0);
			var v = Vector.subtract(triangle.v2, triangle.v0);
			var w = Vector.subtract(P1, triangle.v0);

			var uv = Vector.dot(u, v);
			var wv = Vector.dot(w, v);
			var vv = Vector.dot(v, v);
			var uu = Vector.dot(u, u);
			var uw = Vector.dot(u, w);

			var n1 = (uv*wv) - (vv*uw);
			var n2 = (uv*uw) - (uu*wv);
			var d = (uv*uv) - (uu*vv);

			var s1 = n1/d;
			var t1 = n2/d;

			if ((s1 >= 0) && (t1 >= 0) && ((s1+t1) <= 1)) {
				return t;
			}
			else {
				return null;
			}

		}
		else {
			return null;
		}
	}
}

function findIntersectionWithEllipse(E, D, ellipse, screenT) {
    A = new Vector(ellipse.a, ellipse.b, ellipse.c);
    C = new Vector(ellipse.x, ellipse.y, ellipse.z);

    /*
    Equation of the Ellipse is:
    ((S-C)/A).((S-C)/A) = 1

    Equation of Line is:
    S = E + t(P-E) = E + Dt

    Point of intersection (t):
    at^2 + bt + c = 0

    a = (D/A).(D/A)
    b = 2*((D/A).((E-C)/A))
    c = ((E-C)/A).((E-C)/A) - 1
    */


    ta = Vector.divide(D, A);
    tb = Vector.divide(Vector.subtract(E, C), A);
    a = Vector.dot(ta,ta);
    b = 2*Vector.dot(ta, tb);
    c = Vector.dot(tb, tb) - 1;

    quadD = (b*b) - (4*a*c);
    // console.log("b*b = ", (b*b))
    // console.log('quadD = ', quadD)

    if (quadD >= 0) {
        var t1 = (-b - Math.sqrt(quadD))/(2*a);
        var t2 = (-b + Math.sqrt(quadD))/(2*a);

        if (t1 > screenT && t2 > screenT) {
            if (t1 < t2) {
                return t1;
            }
            else {
                return t2;
            }
        }
        else if (t1 < screenT && t2 > screenT) {
            return t2;
        }
        else if (t2 < screenT && t1 > screenT) {
            return t1;
        }
        else {
            return null;
        }
    }
    else {
        return null;
    }
}

function correctColorRange(r) {
	r = Math.round((r)*255);
	r = Math.min(r, 255)
	r = Math.max(r, 0)
	return r;
}

function correctColorRange2(r) {
	r = Math.min(r, 255)
	r = Math.max(r, 0)
	return r;
}

function checkShadows(P, light, ei) {
	if (shadowsExtra == 0) {
		return 1;
	}

	var s = 1;
	for(var i = 0; i < inputEllipsoids.length; i++) {
        if(i == ei) { 
        	s = 1; 
        	continue; 
        }

        var ray = Vector.subtract(light, P);

        var lightT = Math.sqrt(Vector.dot(ray,ray));

        var t = findIntersectionWithEllipse(P, ray, inputEllipsoids[i], 0);

        if (t != null) {
			if (t < lightT) {
				s = 0;

			}
        }

    }
    return s;
}

function calculateColor(P, N, eyeTemp, ei, colorStruct, type) {
    // var ellipse = inputEllipsoids[ei];
    //var lights = [{"x": -1.0, "y": 3.0, "z": -0.5, "ambient": [1,1,1], "diffuse": [1,1,1], "specular": [1,1,1]}] 
    
    //Color = La*Ka + Ld*Kd*(N.L) + Ls*Ks*(N.H)^n
    
    var r = 0.0;
    var g = 0.0;
    var b = 0.0;
    for (var l=0; l < lights.length; l++){
        var light = lights[l];
        var lightPos = new Vector(light.x, light.y, light.z);
        var lightColorA = new Color(light.ambient[0], light.ambient[1], light.ambient[2]);
        var lightColorD = new Color(light.diffuse[0], light.diffuse[1], light.diffuse[2]);
        var lightColorS = new Color(light.specular[0], light.specular[1], light.specular[2]);

        // Ambient
        var r1 = correctColorRange(colorStruct.ambient[0]*lightColorA.r);
        var g1 = correctColorRange(colorStruct.ambient[1]*lightColorA.g);
        var b1 = correctColorRange(colorStruct.ambient[2]*lightColorA.b);


        //diffuse
        // var N = calculateNormalForEllipsoid(P, ellipse);
        N = Vector.normalize(N);
        var L = Vector.normalize(Vector.subtract(lightPos, P));

        var ndotl = Vector.dot(N, L);

        var r2 = correctColorRange(lightColorD.r*colorStruct.diffuse[0]*ndotl);
        var g2 = correctColorRange(lightColorD.g*colorStruct.diffuse[1]*ndotl);
        var b2 = correctColorRange(lightColorD.b*colorStruct.diffuse[2]*ndotl);

        //specular
        var V = Vector.normalize(Vector.subtract(eyeTemp, P));
        var H = Vector.normalize(Vector.add(L, V));
        var ndothn = Math.pow(Vector.dot(N, H), colorStruct.n);

        var r3 = correctColorRange(lightColorS.r*colorStruct.specular[0]*ndothn);
        var g3 = correctColorRange(lightColorS.g*colorStruct.specular[1]*ndothn);
        var b3 = correctColorRange(lightColorS.b*colorStruct.specular[2]*ndothn);

        var s = 1;
        if (type == "ellipsoid")
        	s = checkShadows(P, lightPos, ei);


        // Add'em all up
        r += (r1 + s*(r2 + r3));
        g += (g1 + s*(g2 + g3));
        b += (b1 + s*(b2 + b3));
    }
    
    // Round up and get them in limits
    r = correctColorRange2(r);
    g = correctColorRange2(g);
    b = correctColorRange2(b);

    var col = new Color(r,g,b);
    //col = new Color(ellipse.diffuse[0]*255, ellipse.diffuse[1]*255, ellipse.diffuse[2]*255);
    return col;
}

function calculateCoords(eyeTemp, lookAtTemp, viewUpTemp) {
    var lookAtDir = Vector.normalize(lookAtTemp);
    var center = Vector.add(eyeTemp, Vector.scale(distanceFromEye, lookAtDir));

    var leftDir = new Vector();
    leftDir.x = (lookAtTemp.y*viewUpTemp.z) - (lookAtTemp.z*viewUpTemp.y);
    leftDir.y = (lookAtTemp.z*viewUpTemp.x) - (lookAtTemp.x*viewUpTemp.z);
    leftDir.z = (lookAtTemp.x*viewUpTemp.y) - (lookAtTemp.y*viewUpTemp.x);

    var leftDir = Vector.normalize(leftDir);
    var viewUpDir = Vector.normalize(viewUpTemp);

    u_mid = Vector.add(center, Vector.scale(realH/2, viewUpDir));
    l_mid = Vector.add(center, Vector.scale(-realH/2, viewUpDir));

    ul = Vector.add(u_mid, Vector.scale(realW/2, leftDir));
    ur = Vector.add(u_mid, Vector.scale(-realW/2, leftDir));
    ll = Vector.add(l_mid, Vector.scale(realW/2, leftDir));
    lr = Vector.add(l_mid, Vector.scale(-realW/2, leftDir));

    var result = new Array(4);
    result[0] = ul;
    result[1] = ur;
    result[2] = ll;
    result[3] = lr;

    return result;
}

function getTriangles(triangleJSON) {	
	var vertices = new Array(triangleJSON[1].vertices.length);
	var triangles = new Array(triangleJSON[2].triangles.length);

	for(var i = 0; i < vertices.length; i++) {
		var vertex = triangleJSON[1].vertices[i];
		var t = new Vector(vertex[0], vertex[1], vertex[2]);
		vertices[i] = t;
	}

	for(var i = 0; i < triangles.length; i++) {
		var triangle = triangleJSON[2].triangles[i];
		var t = new Triangle(vertices[triangle[0]], vertices[triangle[1]], vertices[triangle[2]]);
		triangles[i] = t;
	}

	return triangles;
}


function raycasting(context) {
	var triangleJSON = getInputEllipsoids("https://ncsucgclass.github.io/prog1/triangles.json");
    var material = triangleJSON[0].material;
    material.n = 1;

    var triangles = getTriangles(triangleJSON);
    var n = inputEllipsoids.length;

    var w = context.canvas.width; // as set in html
    var h = context.canvas.height;  // as set in html

    var imagedata = context.createImageData(w,h);

    var result = calculateCoords(eye, lookAt, viewUp);

    var ul = result[0];
	var ur = result[1];
	var ll = result[2];
	var lr = result[3];

    var PA = ul.y*(ur.z - lr.z) + ur.y*(lr.z - ul.z) + lr.y*(ul.z - ur.z);
    var PB = ul.z*(ur.x - lr.x) + ur.z*(lr.x - ul.x) + lr.z*(ul.x - ur.x);
    var PC = ul.x*(ur.y - lr.y) + ur.x*(lr.y - ul.y) + lr.x*(ul.y - ur.y);
    var PD = (-ul.x*((ur.y*lr.z) - (lr.y*ur.z))) + (-ur.x*((lr.y*ul.z) - (ul.y*lr.z))) + (-lr.x*((ul.y*ur.z) - (ur.y*ul.z)));

    var realRightDir = Vector.subtract(ur, ul);
    realRightDir = Vector.normalize(realRightDir);
    var realDownDir = Vector.subtract(ll, ul);
    realDownDir = Vector.normalize(realDownDir);

    for (var i = 0; i < w; i++) {
        for (var j = 0; j < h; j++) {

            var deltaX = Vector.scale((i/w), realRightDir);
            var deltaY = Vector.scale((j/h), realDownDir);

            var realPoint = Vector.add(ul, deltaX);
            realPoint = Vector.add(realPoint, deltaY);

            var rayDir = Vector.subtract(realPoint, eye);

            var screenT = (-((PA*eye.x) + (PB*eye.y) + (PC*eye.z) + PD))/((PA*rayDir.x) + (PB*rayDir.y) + (PC*rayDir.z));

            var realIntersect = null;
            var realEllipse = 0;
            for (var e = 0; e < n; e++) {
                var te = findIntersectionWithEllipse(eye, rayDir, inputEllipsoids[e], screenT);
                // console.log("te = ", te)
                if (te != null) {
                    if (realIntersect != null) {
                        if (realIntersect > te) {
                            realIntersect = te;
                            realEllipse = e;
                        }
                    }
                    else {
                        realIntersect = te;
                        realEllipse = e;
                    }
                }
            }

            var realTriangle = 0;
            var realIntersectT = null;

            if (trianglesExtra == 1) {
	            for (var tr = 0; tr < triangles.length; tr++) {
	                var te = findIntersectionWithTriangle(eye, rayDir, triangles[tr], screenT);
	                // console.log("te = ", te)
	                if (te != null) {
	                    if (realIntersectT != null) {
	                        if (realIntersectT > te) {
	                            realIntersectT = te;
	                            realTriangle = tr;
	                        }
	                    }
	                    else {
	                        realIntersectT = te;
	                        realTriangle = tr;
	                    }
	                }
	            }
        	}

            var N = null;
            var type = null;
            var real_var = null;
            var col = null;
            if (realIntersect != null) {
            	if (realIntersectT != null) {
            		if (realIntersect < realIntersectT) {
            			type = "ellipsoid";
            		}
            		else {
            			type = "triangle";
            		}
            	}
            	else {
            		type = "ellipsoid";
            	}
            }
            else {
            	if (realIntersectT != null) {
            		type = "triangle"
            	}
            	else {
            		type = "none";
            	}
            }

            if (type == "ellipsoid") {
            	real_var = realIntersect;
            	P = Vector.add(eye, Vector.scale(realIntersect, rayDir));
            	N = calculateNormalForEllipsoid(P, inputEllipsoids[realEllipse]);
            	col = calculateColor(P, N, eye, realEllipse, inputEllipsoids[realEllipse], "ellipsoid");
            }
            else if (type == "triangle"){
            	real_var = realIntersectT;
            	P = Vector.add(eye, Vector.scale(realIntersectT, rayDir));
            	N = calculateNormalForTriangle(triangles[realTriangle]);
            	col = calculateColor(P, N, eye, realTriangle, material, "triangle");
            }
            else {
            	col = new Color(0 ,0, 0, 255);
            }
            
            drawPixel(imagedata, i, j, col);
        }
    }
    context.putImageData(imagedata, 0, 0);

}

// Extra Credit: Changeable Parameters from UI
function updateParams() {
    // Update Canvas Height and Width
    var width = document.getElementById('width').value;
    var height = document.getElementById('height').value;

    var canvas = document.getElementById('viewport');
    canvas.setAttribute('height', height);
    canvas.setAttribute('width', width);

    // Update Eye Position
    var eyex = document.getElementById('eyex').value;
    var eyey = document.getElementById('eyey').value;
    var eyez = document.getElementById('eyez').value;

    eye = new Vector(parseFloat(eyex), parseFloat(eyey), parseFloat(eyez));

    // Update look At vector
    var lookatx = document.getElementById('lookatx').value;
    var lookaty = document.getElementById('lookaty').value;
    var lookatz = document.getElementById('lookatz').value;

    lookAt = new Vector(parseFloat(lookatx), parseFloat(lookaty), parseFloat(lookatz));
    lookAt = Vector.normalize(lookAt);

    // Update view Up Vector
    var lookupx = document.getElementById('lookupx').value;
    var lookupy = document.getElementById('lookupy').value;
    var lookupz = document.getElementById('lookupz').value;

    viewUp = new Vector(parseFloat(lookupx), parseFloat(lookupy), parseFloat(lookupz));
    viewUp = Vector.normalize(viewUp);

    //Shadows
    var shadowTemp = document.getElementById('shadows').checked;
    if (shadowTemp == true) {
    	shadowsExtra = 1;
    }
    else {
		shadowsExtra = 0;
    }

	//Triangles
    var triangleTemp = document.getElementById('triangles').checked;
    if (triangleTemp == true) {
    	trianglesExtra = 1;
    }
    else {
		trianglesExtra = 0;
    }

    // Re-render the view
    start();
}


function start() {
    var canvas = document.getElementById("viewport"); 
    var context = canvas.getContext("2d"); 

    raycasting(context);

}


/* main -- here is where execution begins after window load */
function main() {
	updateParams();
	start();
}