/**
 * MyCylinder
 * @constructor
 * @param scene - Reference to MyScene object
 * @param base - Radius of cylinder base
 * @param top - Radius of cylinder top
 * @param height - Height of cylinder
 * @param slices - Number of slices of cylinder
 * @param stacks - Number of stacks of cylinder
 */
class MyCylinder extends CGFobject {
	constructor(scene, base, top, height, slices, stacks) {
		super(scene);
		this.base = base;
		this.top = top;
		this.height = height;
		this.slices = slices;
		this.stacks = stacks;

		this.deltaHeight = this.height / this.stacks;
		this.delta = (this.top - this.base) / this.stacks;

		this.initBuffers();
	}

	initBuffers() {
		var n = -2 * Math.PI / this.slices;

		this.vertices = [];
		this.normals = [];
		this.indices = [];
		this.texCoords = [];


		var lengthX = 1 / this.slices;
		var lengthY = 1 / this.stacks;
		var xCoord = 0;
		var yCoord = 0;

		for (var q = 0; q <= this.stacks; q++) {
			var z = (q * this.deltaHeight / this.stacks);
			var inc = (q * this.delta) + this.base;

			for (var i = 0; i <= this.slices; i++) {
				this.vertices.push(inc * Math.cos(i * n), inc * Math.sin(i * n), q * this.deltaHeight);
				this.normals.push(Math.cos(i * n), Math.sin(i * n), 0);

				this.texCoords.push(xCoord, yCoord);

				xCoord += lengthX;
			}

			xCoord = 0;
			yCoord += lengthY;
		}

		var sides = this.slices + 1;

		for (var q = 0; q < this.stacks; q++) {
			for (var i = 0; i < this.slices; i++) {
				this.indices.push(sides * q + i, sides * (q + 1) + i, sides * q + i + 1);
				this.indices.push(sides * q + i + 1, sides * (q + 1) + i, sides * (q + 1) + i + 1);

				this.indices.push(sides * q + i, sides * q + i + 1, sides * (q + 1) + i);
				this.indices.push(sides * q + i + 1, sides * (q + 1) + i + 1, sides * (q + 1) + i);
			}
		}

		/*
		Texture coords (s,t)
		+----------> s
        |
        |
		|
		v
        t
        */

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}

	/**
	 * @method updateTexCoords
	 * Updates the list of texture coordinates of the cylinder
	 * @param length_s - Scale of texture coordinates in S
 	 * @param length_t - Scale of texture coordinates in T
	 */
	updateTexCoords(length_s, length_t) {
		this.texCoords = [];

		for (var i = 0; i <= this.slices; i++) {
			for (var j = 0; j <= this.stacks; j++) {
				this.texCoords.push((i / this.slices) / length_s, (j / this.stacks) / length_t);
			}
		}

		this.updateTexCoordsGLBuffers();
	}
}

