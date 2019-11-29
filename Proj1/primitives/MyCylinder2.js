/**
 * MyCylinder2
 * @constructor
 * @param scene - Reference to MyScene object
 * @param base - Radius of cylinder base
 * @param top - Radius of cylinder top
 * @param height - Height of cylinder
 * @param slices - Number of slices of cylinder
 * @param stacks - Number of stacks of cylinder
 */
class MyCylinder2 extends CGFobject {
	constructor(scene, id, base, top, height, slices, stacks) {
		super(scene);
		this.base = base;
		this.top = top;
		this.height = height;
		this.slices = slices;
		this.stacks = stacks;
		this.degree1 = 3;	//or 1
		this.degree2 = 1;	//or 8

		this.controlVertexes =
			[// U = 0
				[// V = 0..1
					[-this.top, 0.0, this.height, 1],
					[-this.base, 0.0, 0.0, 1]
				],
				// U = 1
				[// V = 0..1
					[-this.top, (4 / 3) * this.top, this.height, 1],
					[-this.base, (4 / 3) * this.base, 0.0, 1]
				],
				// U = 2
				[// V = 0..1
					[this.top, (4 / 3) * this.top, this.height, 1],
					[this.base, (4 / 3) * this.base, 0.0, 1]
				],
				// U = 3
				[// V = 0..1
					[this.top, 0.0, this.height, 1],
					[this.base, 0.0, 0.0, 1]
				]
			];

		this.makeSurface();
	}

	makeSurface() {
		var nurbsSurface = new CGFnurbsSurface(this.degree1, this.degree2, this.controlVertexes);

		this.surface = new CGFnurbsObject(this.scene, Math.ceil(this.slices / 2), this.stacks, nurbsSurface); // must provide an object with the function getPoint(u, v) (CGFnurbsSurface has it)
	}

	display() {
		this.scene.pushMatrix();
		this.surface.display();		// top part
		this.scene.popMatrix();

		this.scene.pushMatrix();
		this.scene.rotate(Math.PI, 0, 0, 1);
		this.surface.display();		// bottom part
		this.scene.popMatrix();
	}

	/**
	 * @method updateTexCoords
	 * Updates the list of texture coordinates of the cylinder
	 * @param length_s - Scale of texture coordinates in S
 	 * @param length_t - Scale of texture coordinates in T
	 */
	updateTexCoords(length_s, length_t) {
		this.surface.texCoords = [];

		for (var i = 0; i <= this.slices; i++) {
			for (var j = 0; j <= this.stacks; j++) {
				this.surface.texCoords.push((i / this.slices) / length_s, (j / this.stacks) / length_t);
			}
		}

		this.surface.initBuffers();
	}
}

