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
			break;

		case 112: //p
			break;

	}
	renderStuff();
}