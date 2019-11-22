/**
 * MyPlane
 * @constructor
 * @param scene - Reference to MyScene object
 * @param npartsU - Divisions in U
 * @param npartsV - Divisions in V
 */
class MyPlane extends CGFobject {
    constructor(scene, id, npartsU, npartsV) {
        super(scene);
        this.scene = scene;
        this.npartsU = npartsU;
        this.npartsV = npartsV;

        this.controlVertexes =
            [// U = 0
                [// V = 0..1
                    [-0.5, 0, 0.5, 1],
                    [-0.5, 0, -0.5, 1]
                ],
                // U = 1
                [// V = 0..1
                    [0.5, 0, 0.5, 1],
                    [0.5, 0, -0.5, 1]
                ]
            ];

        this.makeSurface();
    }

    makeSurface() {
        var nurbsSurface = new CGFnurbsSurface(1, 1, this.controlVertexes);

        this.surface = new CGFnurbsObject(this.scene, this.npartsU, this.npartsV, nurbsSurface); // must provide an object with the function getPoint(u, v) (CGFnurbsSurface has it)
    }

    display() {
        this.scene.pushMatrix();
        this.surface.display();
        this.scene.popMatrix();
    }

    /**
	 * @method updateTexCoords
	 * Updates the list of texture coordinates of the plane
	 * @param length_s - Scale of texture coordinates in S
 	 * @param length_t - Scale of texture coordinates in T
	 */
    updateTexCoords(length_s, length_t) {
        var t3 = [0, 0];
        var t4 = [1 / length_s, 0];
        var t2 = [1 / length_s, 1 / length_t];
        var t1 = [0, 1 / length_t];

        this.surface.texCoords = t1.concat(t2.concat(t3.concat(t4)));
        this.surface.initBuffers();
    }
}