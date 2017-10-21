function keyboard(e) {
	switch(e.keyCode) {
		// Part 4g
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


		// Part 6
		case 98:
			phong = !phong;
			break;

		case 110:
			if (highlight_ellipsoid_index > -1) {
				inputEllipsoids[highlight_ellipsoid_index].n += 1;
				inputEllipsoids[highlight_ellipsoid_index].n %= 20;
			}
			break;
		case 49:
			if (highlight_ellipsoid_index > -1) {
				var temp = inputEllipsoids[highlight_ellipsoid_index].ambient;
				temp[0] += 0.1; temp[0] %= 1.0;
				temp[1] += 0.1; temp[1] %= 1.0;
				temp[2] += 0.1; temp[2] %= 1.0;
				inputEllipsoids[highlight_ellipsoid_index].ambient = temp;
			}
			else if (highlight_triangle_index > -1) {
				var temp = inputTriangles[highlight_triangle_index].material.ambient;
				temp[0] += 0.1; temp[0] %= 1.0;
				temp[1] += 0.1; temp[1] %= 1.0;
				temp[2] += 0.1; temp[2] %= 1.0;
				inputTriangles[highlight_triangle_index].material.ambient = temp;
			}
			break;

		case 50:
			if (highlight_ellipsoid_index > -1) {
				var temp = inputEllipsoids[highlight_ellipsoid_index].diffuse;
				temp[0] += 0.1; temp[0] %= 1.0;
				temp[1] += 0.1; temp[1] %= 1.0;
				temp[2] += 0.1; temp[2] %= 1.0;
				inputEllipsoids[highlight_ellipsoid_index].diffuse = temp;
			}
			else if (highlight_triangle_index > -1) {
				var temp = inputTriangles[highlight_triangle_index].material.diffuse;
				temp[0] += 0.1; temp[0] %= 1.0;
				temp[1] += 0.1; temp[1] %= 1.0;
				temp[2] += 0.1; temp[2] %= 1.0;
				inputTriangles[highlight_triangle_index].material.diffuse = temp;
			}
			break;

		case 51:
			if (highlight_ellipsoid_index > -1) {
				var temp = inputEllipsoids[highlight_ellipsoid_index].specular;
				temp[0] += 0.1; temp[0] %= 1.0;
				temp[1] += 0.1; temp[1] %= 1.0;
				temp[2] += 0.1; temp[2] %= 1.0;
				inputEllipsoids[highlight_ellipsoid_index].specular = temp;
			}
			else if (highlight_triangle_index > -1) {
				var temp = inputTriangles[highlight_triangle_index].material.specular;
				temp[0] += 0.1; temp[0] %= 1.0;
				temp[1] += 0.1; temp[1] %= 1.0;
				temp[2] += 0.1; temp[2] %= 1.0;
				inputTriangles[highlight_triangle_index].material.specular = temp;
			}
			break;

		// Part 7 Translations
		case 107: //k
			if (highlight_triangle_index > -1) {
				triangle_translations[highlight_triangle_index][0] += 0.05
			}
			else if (highlight_ellipsoid_index > -1) {
				ellipsoid_translations[highlight_ellipsoid_index][0] += 0.05
			}
			break;

		case 59: //;
			if (highlight_triangle_index > -1) {
				triangle_translations[highlight_triangle_index][0] -= 0.05;
			}
			else if (highlight_ellipsoid_index > -1) {
				ellipsoid_translations[highlight_ellipsoid_index][0] -= 0.05
			}
			break;

		case 111: //o
			if (highlight_triangle_index > -1) {
				triangle_translations[highlight_triangle_index][1] += 0.05;
			}
			else if (highlight_ellipsoid_index > -1) {
				ellipsoid_translations[highlight_ellipsoid_index][1] += 0.05
			}
			break;

		case 108: //l
			if (highlight_triangle_index > -1) {
				triangle_translations[highlight_triangle_index][1] -= 0.05;
			}
			else if (highlight_ellipsoid_index > -1) {
				ellipsoid_translations[highlight_ellipsoid_index][1] -= 0.05
			}
			break;

		case 105: //i
			if (highlight_triangle_index > -1) {
				triangle_translations[highlight_triangle_index][2] += 0.05;
			}
			else if (highlight_ellipsoid_index > -1) {
				ellipsoid_translations[highlight_ellipsoid_index][2] += 0.05
			}
			break;

		case 112: //p
			if (highlight_triangle_index > -1) {
				triangle_translations[highlight_triangle_index][2] -= 0.05;
			}
			else if (highlight_ellipsoid_index > -1) {
				ellipsoid_translations[highlight_ellipsoid_index][2] -= 0.05
			}
			break;


		// Part 7 Rotations
		case 75: //K
			if (highlight_triangle_index > -1) {
				transformTriangles[highlight_triangle_index][1] += 0.05
			}
			else if (highlight_ellipsoid_index > -1) {
				transformEllipsoids[highlight_ellipsoid_index][1] += 0.05
			}
			break;

		case 58: //:
			if (highlight_triangle_index > -1) {
				transformTriangles[highlight_triangle_index][1] -= 0.05
			}
			else if (highlight_ellipsoid_index > -1) {
				transformEllipsoids[highlight_ellipsoid_index][1] -= 0.05
			}
			break;
		case 79: //O
			if (highlight_triangle_index > -1) {
				transformTriangles[highlight_triangle_index][0] += 0.05
			}
			else if (highlight_ellipsoid_index > -1) {
				transformEllipsoids[highlight_ellipsoid_index][0] += 0.05
			}
			break;

		case 76: //L
			if (highlight_triangle_index > -1) {
				transformTriangles[highlight_triangle_index][0] -= 0.05
			}
			else if (highlight_ellipsoid_index > -1) {
				transformEllipsoids[highlight_ellipsoid_index][0] -= 0.05
			}
			break;
		case 73: //I
			if (highlight_triangle_index > -1) {
				transformTriangles[highlight_triangle_index][2] -= 0.05
			}
			else if (highlight_ellipsoid_index > -1) {
				transformEllipsoids[highlight_ellipsoid_index][2] -= 0.05
			}
			break;

		case 80: //P
			if (highlight_triangle_index > -1) {
				transformTriangles[highlight_triangle_index][2] += 0.05
			}
			else if (highlight_ellipsoid_index > -1) {
				transformEllipsoids[highlight_ellipsoid_index][2] += 0.05
			}
			break;

	}
	renderStuff();
}

function keyboard2(e){
	switch(e.keyCode) {
			// Part 5
		case 32:
			highlight_triangle_index = -1;
			highlight_ellipsoid_index = -1;
			break;
		case 38:
			highlight_triangle_index = -1;
			highlight_ellipsoid_index++;
			highlight_ellipsoid_index %= inputEllipsoids.length;
			break;
		case 40:
			highlight_triangle_index = -1;
			highlight_ellipsoid_index += inputEllipsoids.length - 1;
			highlight_ellipsoid_index %= inputEllipsoids.length;
			break;
		case 39:
			highlight_ellipsoid_index = -1;
			highlight_triangle_index++;
			highlight_triangle_index %= inputTriangles.length;
			break;
		case 37:
			highlight_ellipsoid_index = -1;
			highlight_triangle_index += inputTriangles.length - 1;
			highlight_triangle_index %= inputTriangles.length;
			break;
	}
	renderStuff();
}