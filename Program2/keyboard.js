function keyboard(e) {
	switch(e.keyCode) {
		case 97:
			Eye[0] -= 0.05; Center[0] -= 0.05; break;
		case 100:
			Eye[0] += 0.05; Center[0] += 0.05; break;
		case 101:
			Eye[1] += 0.05; Center[1] += 0.05; break;
		case 113:
			Eye[1] -= 0.05; Center[1] -= 0.05; break;
		case 115:
			Eye[2] += 0.05; Center[2] += 0.05; break;
		case 119:
			Eye[2] -= 0.05; Center[2] -= 0.05; break;
		case  65: 
			Center[0] -= 0.05; break;
		case  68: 
			Center[0] += 0.05; break;
		case  83: 
			Center[1] -= 0.05; break;
		case  87: 
			Center[1] += 0.05; break;


		case 32:
			highlight_triangle_index = -1;
			highlight_ellipsoid_index = -1;
			loadTriangles(); loadEllipsoids(); break;
		case 38:
			highlight_triangle_index = -1;
			highlight_ellipsoid_index++;
			highlight_ellipsoid_index %= inputEllipsoids.length;
			loadTriangles(); loadEllipsoids(); break;
		case 40:
			highlight_triangle_index = -1;
			highlight_ellipsoid_index += inputEllipsoids.length - 1;
			highlight_ellipsoid_index %= inputEllipsoids.length;
			loadTriangles(); loadEllipsoids(); break;
		case 39:
			highlight_ellipsoid_index = -1;
			highlight_triangle_index++;
			highlight_triangle_index %= inputTriangles.length;
			loadTriangles(); loadEllipsoids(); break;
		case 37:
			highlight_ellipsoid_index = -1;
			highlight_triangle_index += inputTriangles.length - 1;
			highlight_triangle_index %= inputTriangles.length;
			loadTriangles(); loadEllipsoids(); break;

		case 110:
			diffSpecularExp++;
			// diffSpecularExp %= maxSpecularExp;
			loadEllipsoids(); break;

	}
	renderStuff();
}