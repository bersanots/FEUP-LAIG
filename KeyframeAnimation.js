/**
 * KeyFrameAnimation
 * @constructor
 * @param scene - Reference to MyScene object
 */

class KeyframeAnimation extends Animation {
    constructor(scene, keyframes) {
        super(scene);
        this.keyframes = keyframes;
        this.instants = Object.keys(keyframes);

        this.matrix = mat4.create();    // Create transformation matrix
        mat4.identity(this.matrix);    // Initial value for transformation matrix

        this.startTime = 0;
        this.stage = 0;     // stage = order number of a keyframe instant on the keyframes array
    }

    // Updates the initial values according to the keyframes and the time passed
    update(t) {
        this.startTime += t;

        if (this.stage < this.instants.length) {
            let breakTime = this.instants[this.stage];

            // Used to save the difference between keyframes instances
            let timeDiff;
            let totalMatrix = mat4.create();
            mat4.identity(this.matrix);

            if (this.stage > 0) {
                timeDiff = breakTime - this.instants[this.stage - 1];
                let negativeMatrix = [-1, 0, 0, 0, 0, -1, 0, 0, 0, 0, -1, 0, 0, 0, 0, -1];
                let nextMatrix = this.keyframes[breakTime];
                mat4.multiply(nextMatrix, nextMatrix, negativeMatrix);
                mat4.multiply(totalMatrix, totalMatrix, nextMatrix);
            }
            else {
                timeDiff = breakTime;
                totalMatrix = this.keyframes[breakTime];
            }

            if (this.startTime <= breakTime) {
                let timeDiffMatrix = [1/timeDiff, 0, 0, 0, 0, 1/timeDiff, 0, 0, 0, 0, 1/timeDiff, 0, 0, 0, 0, 1/timeDiff];
                let tMatrix = [t, 0, 0, 0, 0, t, 0, 0, 0, 0, t, 0, 0, 0, 0, t];
                mat4.multiply(totalMatrix, totalMatrix, timeDiffMatrix);    //
                mat4.multiply(totalMatrix, totalMatrix, tMatrix);           //  this.matrix += (totalMatrix / timeDiff) * t
                mat4.multiply(this.matrix, this.matrix, totalMatrix);       // 
            }

            if (this.startTime > breakTime)
                this.stage++;
        }
    }

    // Applies current transformation matrix to object
    apply() {
        this.scene.multMatrix(this.matrix);
    }
}
