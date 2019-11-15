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
    constructor(scene, id, npointsU, npointsV, npartsU, npartsV, controlpoints) {
        super(scene);
        this.scene = scene;
        this.npointsU = npointsU;
        this.npointsV = npointsV;
        this.npartsU = npartsU;
        this.npartsV = npartsV;
        this.controlpoints = controlpoints;
        this.makeControlPoints();
        this.makeSurface();
    }

    makeControlPoints() {
        var temp = new Array(this.npointsU);

        for (var u = 0; u < this.npointsU; u++) {
            temp[u] = new Array(this.npointsV);
            for (var v = 0; v < this.npointsV; v++) {
                temp[u][v] = this.controlpoints[u * this.npointsV + v];
            }
        }
        this.controlpoints = temp;
    }

    makeSurface() {
        var nurbsSurface = new CGFnurbsSurface(this.npartsU, this.npartsV, this.controlpoints);

        this.surface = new CGFnurbsObject(this.scene, 20, 20, nurbsSurface); // must provide an object with the function getPoint(u, v) (CGFnurbsSurface has it)
    }
}