/**
 * Animation
 * @constructor
 */
class Animation {
    constructor(scene) {

        this.scene = scene;
        this.currTime = 0;
    }

    update(d_time) {
        this.currTime += d_time;
        return this.currTime;
    }
}

