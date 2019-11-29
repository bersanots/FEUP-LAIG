/**
 * MyTriangle
 * @constructor
 * @param scene - Reference to MyScene object
 * @param x - Scale of triangle in X
 * @param y - Scale of triangle in Y
 * @param z - Scale of triangle in Z
 */
class MyTriangle extends CGFobject {
	constructor(scene, id, x1, x2, x3, y1, y2, y3, z1, z2, z3) {
		super(scene);
		this.x1 = x1;
		this.x2 = x2;
		this.x3 = x3;
		this.y1 = y1;
		this.y2 = y2;
		this.y3 = y3;
		this.z1 = z1;
		this.z2 = z2;
		this.z3 = z3;

		this.initBuffers();
	}
	
	initBuffers() {
		this.vertices = [
			this.x1, this.y1, this.z1,	//0
			this.x2, this.y2, this.z2,	//1
			this.x3, this.y3, this.z3	//2
		];

		//Counter-clockwise reference of vertices
		this.indices = [
			0, 1, 2
		];

		var x = ((this.y2 - this.y1)*(this.z3 - this.z1) - (this.z2 - this.z1)*(this.y3 - this.y1))/
					Math.sqrt(Math.pow((this.y2 - this.y1)*(this.z3 - this.z1) - (this.z2 - this.z1)*(this.y3 - this.y1),2) + 
								Math.pow((this.z2 - this.z1)*(this.x3 - this.x1) - (this.x2 - this.x1) * (this.z3 - this.z1),2) + 
								Math.pow((this.x2 - this.x1)*(this.y3 - this.y1) - (this.y2 - this.y1)*(this.x3 - this.x1),2));
    	var y = ((this.z2 - this.z1)*(this.x3 - this.x1) - (this.x2 - this.x1)*(this.z3 - this.z1))/
    				Math.sqrt(Math.pow((this.y2 - this.y1)*(this.z3 - this.z1) - (this.z2 - this.z1)*(this.y3 - this.y1), 2) + 
    							Math.pow((this.z2 - this.z1)*(this.x3 - this.x1) - (this.x2 - this.x1)*(this.z3 - this.z1),2) + 
    							Math.pow((this.x2 - this.x1)*(this.y3 - this.y1) - (this.y2 - this.y1)*(this.x3 - this.x1),2));
    	var z = ((this.x2 - this.x1)*(this.y3 - this.y1) - (this.y2 - this.y1)*(this.x3 - this.x1))/
    				Math.sqrt(Math.pow((this.y2 - this.y1)*(this.z3 - this.z1)- (this.z2 - this.z1)*(this.y3 - this.y1), 2) + 
    							Math.pow((this.z2 - this.z1)*(this.x3 - this.x1) - (this.x2 - this.x1)*(this.z3 - this.z1),2) + 
    							Math.pow((this.x2 - this.x1)*(this.y3 - this.y1) - (this.y2 - this.y1)*(this.x3 - this.x1), 2));

		//Facing Z positive
		this.normals = [
			x, y, z,
   			x, y, z,
   			x, y, z
		];
		
		/*
		Texture coords (s,t)
		+----------> s
        |
        |
		|
		v
        t
        */

		this.texCoords = [
			0, 0,
			1, 0,
			1, 1
		]

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}

	/**
	 * @method updateTexCoords
	 * Updates the list of texture coordinates of the triangle
	 * @param length_s - Scale of texture coordinates in S
 	 * @param length_t - Scale of texture coordinates in T
	 */
	updateTexCoords(length_s, length_t) {
		var a = Math.sqrt(Math.pow(this.x2 - this.x1, 2) + Math.pow(this.y2 - this.y1, 2) + Math.pow(this.z2 - this.z1, 2));
		var b = Math.sqrt(Math.pow(this.x3 - this.x2, 2) + Math.pow(this.y3 - this.y2, 2) + Math.pow(this.z3 - this.z2, 2));
		var c = Math.sqrt(Math.pow(this.x1 - this.x3, 2) + Math.pow(this.y1 - this.y3, 2) + Math.pow(this.z1 - this.z3, 2));

		var cos_angle = (Math.pow(a,2) - Math.pow(b,2) + Math.pow(c,2)) / (2*a*c);
		var sin_angle = Math.sqrt(1 - Math.pow(cos_angle,2));

		var t1 = [0,0];
		var t2 = [a/length_s,0];
		var t3 = [c*cos_angle/length_s, c*sin_angle/length_t];
		
		this.texCoords = t1.concat(t2.concat(t3));
		this.updateTexCoordsGLBuffers();
	}
}

