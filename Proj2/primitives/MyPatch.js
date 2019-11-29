/**
 * MyPatch
 * @constructor
 * @param scene - Reference to MyScene object
 * @param npointsU - Control points in U
 * @param npointsV - Control points in V
 * @param npartsU - Divisions in U
 * @param npartsV - Divisions in V
 * @param controlpoints - List of control points
 */
class MyPatch extends CGFobject {
    constructor(scene, npointsU, npointsV, npartsU, npartsV, controlPoints) {
        super(scene);
        this.scene = scene;
        this.npointsU = npointsU;
        this.npointsV = npointsV;
        this.npartsU = npartsU;
        this.npartsV = npartsV;
        this.degree1 = npointsU - 1;
        this.degree2 = npointsV - 1;
        this.controlPoints = controlPoints;

        this.makeControlVertexes();
        this.makeSurface();
    }

    makeControlVertexes() {
        this.controlVertexes = new Array(this.npointsU);

        for (var u = 0; u < this.npointsU; u++) {
            this.controlVertexes[u] = new Array(this.npointsV);
            for (var v = 0; v < this.npointsV; v++) {
                let coords = this.controlPoints[u * this.npointsV + v];
                coords.push(1); // w = 1 
                this.controlVertexes[u][v] = coords;
            }
        }
    }

    makeSurface() {
        var nurbsSurface = new CGFnurbsSurface(this.degree1, this.degree2, this.controlVertexes);

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