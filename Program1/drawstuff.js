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
} // end color class


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
function getInputEllipsoids() {
    const INPUT_ELLIPSOIDS_URL = 
        "https://ncsucgclass.github.io/prog1/ellipsoids.json";
        
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


function raycasting(context) {
    var inputEllipsoids = getInputEllipsoids();
    var n = inputEllipsoids.length;

    var w = context.canvas.width; // as set in html
    var h = context.canvas.height;  // as set in html
    var imagedata = context.createImageData(w,h);

    var eye = new Vector(0.5, 0.5, -0.5);
    var viewUp = new Vector(0,1,0);
    var lookAt = new Vector(0,0,1);
    var distanceFromEye = 0.5;
    var realW = 1;
    var realH = 1;
    var lightPos = new Vector(-1,3,-0.5);
    var lightColor = new Color(1,1,1);

    var ul = new Vector(0, 1, 0)
    var ur = new Vector(1, 1, 0);
    var ll = new Vector(0, 0, 0);
    var lr = new Vector(1, 0, 0);

    var PA = ul.y*(ur.z - lr.z) + ur.y*(lr.z - ul.z) + lr.y*(ul.z - ur.z);
    var PB = ul.z*(ur.x - lr.x) + ur.z*(lr.x - ul.x) + lr.z*(ul.x - ur.x);
    var PC = ul.x*(ur.y - lr.y) + ur.x*(lr.y - ul.y) + lr.x*(ul.y - ur.y);
    var PD = (-ul.x*((ur.y*lr.z) - (lr.y*ur.z))) + (-ur.x*((lr.y*ul.z) - (ul.y*lr.z))) + (-lr.x*((ul.y*ur.z) - (ur.y*ul.z)));

    for (var i = 0; i < w; i++) {
        for (var j = 0; j < h; j++) {
            var realX = (i/w)*(ur.x - ul.x) + ul.x;
            var realY = (j/h)*(ll.y - ul.y) + ul.y;
            var realZ = 0;

            var realPoint = new Vector(realX, realY, realZ);
            // console.log(realPoint)

            var rayDir = Vector.subtract(realPoint, eye);
            // console.log(rayDir)

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
            var col = null;
            if (realIntersect != null) {
                //Color = La*Ka + Ld*Kd*(N.L) + Ls*Ks*(N.H)^n
                var P = Vector.add(eye, Vector.scale(realIntersect, rayDir));
                var ellipse = inputEllipsoids[realEllipse];
                
                // Ambient
                var r1 = ellipse.ambient[0]*lightColor.r;
                var g1 = ellipse.ambient[1]*lightColor.g;
                var b1 = ellipse.ambient[2]*lightColor.b;


                //diffuse
                var C = new Vector(ellipse.x, ellipse.y, ellipse.z);
                var A = new Vector(ellipse.a, ellipse.b, ellipse.c);
                A = Vector.multiply(A, A);
                //A = Vector.scale(0.5, A);
                var N = Vector.divide(Vector.subtract(P, C), A);
                N = Vector.normalize(N);

                var L = Vector.normalize(Vector.subtract(lightPos, P));

                var ndotl = Vector.dot(N, L);

                var r2 = lightColor.r*ellipse.diffuse[0]*ndotl;
                var g2 = lightColor.g*ellipse.diffuse[1]*ndotl;
                var b2 = lightColor.b*ellipse.diffuse[2]*ndotl;

                //specular
                var V = Vector.normalize(Vector.subtract(eye, P));
                var H = Vector.normalize(Vector.add(L, V));
                var ndothn = Math.pow(Vector.dot(N, H), ellipse.n);

                var r3 = lightColor.r*ellipse.specular[0]*ndothn;
                var g3 = lightColor.g*ellipse.specular[1]*ndothn;
                var b3 = lightColor.b*ellipse.specular[2]*ndothn;


                // Add'em all up

                var r = Math.round((r1+r2+r3)*255);
                var g = Math.round((g1+g2+g3)*255);
                var b = Math.round((b1+b2+b3)*255);

                r = Math.min(r, 255)
                g = Math.min(g, 255)
                b = Math.min(b, 255)

                r = Math.max(r, 0)
                g = Math.max(g, 0)
                b = Math.max(b, 0)


                col = new Color(r,g,b, 255);

                // This is the nearest point of intersection in all ellipses. Display it as you like                
            }
            else {
                // This Ray does not intersect any ellipses. Display Default Color.
                col = new Color(0 ,0, 0, 255);

            }
            // console.log("i = " + i + " j = " + j)
            // console.log("col = " + col.r + " " + col.g + " " + col.b)
            
            drawPixel(imagedata, i, j, col);
        }
    }
    context.putImageData(imagedata, 0, 0);

}

// Extra Credit: Changeable Height and Width of the canvas
function changeHeight() {
    var width = document.getElementById('width').value;
    var height = document.getElementById('height').value;

    var canvas = document.getElementById('viewport');
    canvas.setAttribute('height', height);
    canvas.setAttribute('width', width);

    main();
}


/* main -- here is where execution begins after window load */

function main() {

    // Get the canvas and context
    var canvas = document.getElementById("viewport"); 
    var context = canvas.getContext("2d"); 
    // Create the image
    //drawRandPixels(context);
      // shows how to draw pixels
    
    //drawRandPixelsInInputEllipsoids(context);
      // shows how to draw pixels and read input file
      
    //drawInputEllipsoidsUsingArcs(context);
    raycasting(context)
      // shows how to read input file, but not how to draw pixels
}
