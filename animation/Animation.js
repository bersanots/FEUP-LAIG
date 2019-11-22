/**
 * Animation
 * @constructor
 */
class Animation {
    constructor(animationId) {
        this.animationId = animationId;
    }

    update(d_time) {
        this.currTime += d_time;
        return this.currTime;
    }

    apply() { }
}

