/**
 * MySphere
 * @constructor
 * @param scene - Reference to MyScene object
 * @param radius - Radius of sphere
 * @param slices - Number of slices of sphere
 * @param stacks - Number of stacks of sphere
 */
class MySphere extends CGFobject {
	constructor(scene, id, radius, slices, stacks) {
		super(scene);
		this.radius = radius;
		this.slices = slices;
        this.stacks = stacks;

		this.initBuffers();
	}
	
	initBuffers() {
		this.vertices = [];
        this.normals = [];
        this.indices = [];
        this.texCoords = [];

        var theta = (2 * Math.PI) / this.slices; // 0->2pi
        var phi = (Math.PI) / this.stacks; // 0->pi
        var n_verts = 0;

        var patchLengthx = 1 / this.slices;
        var patchLengthy = 1 / this.stacks;
        var xCoord = 0;
        var yCoord = 0;


        for (var i = 0; i <= this.slices; i++) {
            for (var j = 0; j <= this.stacks; j++) {

                let x = Math.cos(theta * i) * Math.sin(phi * j);
                let y = Math.sin(theta * i) * Math.sin(phi * j);
                let z = Math.cos(phi * j);

                this.vertices.push(this.radius * x, this.radius * y, this.radius * z);
                n_verts++;

                this.normals.push(x, y, z);

                if (i > 0 && j > 0) {
                    this.indices.push(n_verts - this.stacks - 1, n_verts - 1, n_verts - this.stacks - 2);
                    this.indices.push(n_verts - 1, n_verts - 2, n_verts - this.stacks - 2);
                }

                this.texCoords.push(theta*i / (2*Math.PI), 1 - ((phi*j + Math.PI/2) / Math.PI));
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
	 * Updates the list of texture coordinates of the sphere
	 * @param length_s - Scale of texture coordinates in S
 	 * @param length_t - Scale of texture coordinates in T
	 */
	updateTexCoords(length_s, length_t) {
		this.texCoords = [];

        for (var i = 0; i <= this.slices; i++) {
            for (var j = 0; j <= this.stacks; j++) {
                this.texCoords.push((i/this.slices) / length_t, (j/this.stacks) / length_s);
            }
        }

		this.updateTexCoordsGLBuffers();
	}
}

