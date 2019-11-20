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

    updateTexCoords(length_s, length_t) {
    }
}