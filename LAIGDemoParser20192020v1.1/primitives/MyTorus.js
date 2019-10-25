/**
 * MyTorus
 * @constructor
 * @param scene - Reference to MyScene object
 * @param inner - Inner radius of torus
 * @param outer - Outer radius of torus
 * @param slices - Number of slices of torus
 * @param loops - Number of loops of torus
 */

class MyTorus extends CGFobject{
    constructor(scene, id, inner, outer, slices, loops) {
        super(scene);
        this.outer = outer;
        this.inner = inner;
        this.slices = slices;
        this.loops = loops;

        this.initBuffers();
    };

    initBuffers(){

        this.vertices = [];
        this.normals = [];
        this.indices = [];
        this.texCoords = [];

        var deltaS = 1.0 / this.slices;
        var deltaT = 1.0 / this.loops;
        var s = 0;
	    var t = 0;

        for (var loop_c = 0; loop_c <= this.loops; loop_c++)
          {
            var ang = loop_c * 2 * Math.PI / this.loops;
            s = 0;
            for (var slice_c = 0; slice_c <= this.slices; slice_c++) {
                var phi = slice_c * 2 * Math.PI / this.slices;

                var x = (this.outer + this.inner * Math.cos(phi)) * Math.cos(ang);
                var y = (this.outer + this.inner * Math.cos(phi)) * Math.sin(ang);
                var z = this.inner * Math.sin(phi);

                this.vertices.push(x);
                this.vertices.push(y);
                this.vertices.push(z);

                this.normals.push(x);
                this.normals.push(y);
                this.normals.push(z);

                this.texCoords.push(t,s);
                if (s >= 1)
                	s = 0;
          		else
          			s += deltaS;

            }
            t += deltaT;
        }

        for (var loop_c = 0; loop_c < this.loops; loop_c++) {
            for (var slice_c = 0; slice_c < this.slices; slice_c++) {
                var first = (loop_c * (this.slices + 1)) + slice_c;
                var second = first + this.slices + 1;
                this.indices.push(first, second, first + 1);
                this.indices.push(second, second + 1, first + 1);
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
	 * Updates the list of texture coordinates of the torus
	 * @param length_s - Scale of texture coordinates in S
 	 * @param length_t - Scale of texture coordinates in T
	 */
	updateTexCoords(length_s, length_t) {
		this.texCoords = [];

        for (var loop_c = 0; loop_c <= this.loops; loop_c++) {
        	for (var slice_c = 0; slice_c <= this.slices; slice_c++) {
            	this.texCoords.push((loop_c/this.loops) / length_t, (slice_c/this.slices) / length_s);
            }
        }

		this.updateTexCoordsGLBuffers();
	}

}