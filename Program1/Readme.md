# Program 1 - Ray Casting

### Concepts used in Assignment
In this assignment, following are implemented:
- Ray Casting,
- Illumination - color for pixel using Blin Phong Model

Extra Credit:
- Shadows
- Changeable Canvas Height, Width
- Changeable eye position, view up vector, look at vector





### Problem Statement
General:
You will only render ellipsoids in this assignment, which are described in an input file. We will test your program using several different input files, so it would be wise to test your program with several such files. The input files describe an array of ellipsoids using JSON. An example input file resides at https://ncsucgclass.github.io/prog1/ellipsoids.json. When you turn in your program, you should use this URL in hardcode as the location of the input ellipsoids file — it will always be there. While testing, you should use a different URL referencing a file that you can manipulate, so that you can test multiple ellipsoids files. Note that browser security makes loading local files difficult, so we encourage you to access any input files with HTTP GET requests. <br />

We provide a small shell in which you can build your code. You can run the shell here, and see its code here. The shell shows how to draw pixels without using WebGL, and how to parse the input ellipsoids.json file. It contains three drawing functions: one that merely draws random pixels, one that loads the ellipsoids file and draws orthographic projections of them using canvas draw functions, and one that loads the ellipsoids file and renders some random pixels in them. The last is probably closest to what you must produce for this program. Some of our programming exercises also contain relevant code. <br />

All vertex locations should be described in world coordinates, meaning they do not require any transformation. Locate the eye at (0.5,0.5,-0.5), with a view up vector of [0 1 0] and a look at vector of [0 0 1]. Locate the window a distance of 0.5 from the eye, and make it a 1x1 square normal to the look at vector and centered at (0.5,0.5,0), and parallel to the view up vector. With this scheme, you can assume that everything in the world is in view if it is located in a 1x1x1 box with one corner at the origin, and another at (1,1,1). Put a white (1,1,1) (for ambient, diffuse and specular) light at location (-1,3,-0.5). <br />

### References
For more details, please refer the course webpage: [NCSU Computer Graphics](http://cgclass.csc.ncsu.edu/)
