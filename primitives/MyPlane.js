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
        this.controlvertexes = [];
        this.findControlVertexes();
        this.makeSurface();
    }

    findControlVertexes() {
        for (var i = 0; i <= this.npartsU; i++) {
            let v_vertexes = [];
            for (var j = 0; j <= this.npartsV; j++) {
                v_vertexes.push([(-0.5 + i / this.npartsU), 0, (0.5 - j / this.npartsV), 1]);
            }
            this.controlvertexes.push(v_vertexes);
        }
    }

    makeSurface() {
        var nurbsSurface = new CGFnurbsSurface(this.npartsU, this.npartsV, this.controlvertexes);

        this.surface = new CGFnurbsObject(this.scene, 20, 20, nurbsSurface); // must provide an object with the function getPoint(u, v) (CGFnurbsSurface has it)
    }
}