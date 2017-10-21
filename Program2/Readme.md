# Program 2 - Rasterization

### Concepts used in Assignment
In this assignment, following are implemented:
- Modelling,
- Transforms
- Lighting on 3D Objects

Extra Credit:
- smooth shading with vertex normals


### Problem Statement
General:
You will only render triangles and ellipsoids in this assignment, described in the same sorts of JSON input files used in the first. We will test your program using several different input files, so it would be wise to test your program with several such files. The input files describe arrays of triangles and ellipsoids using JSON. Example input files reside at https://ncsucgclass.github.io/prog2/triangles.json and https://ncsucgclass.github.io/prog2/ellipsoids.json. When you turn in your program, you should use these URLs in hardcode as the locations of the input triangles and ellipsoids files — they will always be there. While testing, you should use a different URL referencing a file that you can manipulate, so that you can test multiple triangles and ellipsoid files. Note that browser security makes loading local files difficult, so we encourage you to access any input files with HTTP GET requests.<br />

We provide a small shell in which you can build your code. You can run the shell here, and see its code and assets here. The shell shows how to draw triangles using WebGL without any model or view transform, and how to parse the input triangles.json file.<br />

The default view and light are as in the first assignment. The eye is at (0.5,0.5,-0.5), view up of [0 1 0], look at vector [0 0 1]. The window has XY view coordinates (0,1,0,1), and is located at view Z=0. Once more, with this default view everything in the world is in view if it is located in a 1x1x1 box with one corner at the origin, and another at (1,1,1). Put a white (1,1,1) (for ambient, diffuse and specular) light at location (-1,3,-0.5).<br />

### References
For more details, please refer the course webpage: [NCSU Computer Graphics](http://cgclass.csc.ncsu.edu/)
