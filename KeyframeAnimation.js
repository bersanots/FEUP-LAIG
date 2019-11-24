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

        this.currentTrans = { x: 0.0, y: 0.0, z: 0.0 };     // Initial value for translation
        this.currentRot = { x: 0.0, y: 0.0, z: 0.0 };       // Initial value for rotation
        this.currentScale = { x: 1.0, y: 1.0, z: 1.0 };     // Initial value for scaling

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

            // Translation parameters
            let transX;
            let transY;
            let transZ;

            // Rotation parameters
            let rotX;
            let rotY;
            let rotZ;

            // Scaling parameters
            let scaleX;
            let scaleY;
            let scaleZ;

            if (this.stage > 0) {
                let prevTime = this.instants[this.stage - 1];

                timeDiff = breakTime - prevTime;

                transX = this.keyframes[breakTime][0][0] - this.keyframes[prevTime][0][0];
                transY = this.keyframes[breakTime][0][1] - this.keyframes[prevTime][0][1];
                transZ = this.keyframes[breakTime][0][2] - this.keyframes[prevTime][0][2];

                rotX = this.keyframes[breakTime][1][0] - this.keyframes[prevTime][1][0];
                rotY = this.keyframes[breakTime][1][1] - this.keyframes[prevTime][1][1];
                rotZ = this.keyframes[breakTime][1][2] - this.keyframes[prevTime][1][2];

                scaleX = this.keyframes[breakTime][2][0] - this.keyframes[prevTime][2][0];
                scaleY = this.keyframes[breakTime][2][1] - this.keyframes[prevTime][2][1];
                scaleZ = this.keyframes[breakTime][2][2] - this.keyframes[prevTime][2][2];
            }
            else {
                timeDiff = breakTime;

                transX = this.keyframes[breakTime][0][0];
                transY = this.keyframes[breakTime][0][1];
                transZ = this.keyframes[breakTime][0][2];

                rotX = this.keyframes[breakTime][1][0];
                rotY = this.keyframes[breakTime][1][1];
                rotZ = this.keyframes[breakTime][1][2];

                scaleX = this.keyframes[breakTime][2][0] - 1;
                scaleY = this.keyframes[breakTime][2][1] - 1;
                scaleZ = this.keyframes[breakTime][2][2] - 1;
            }

            if (this.startTime <= breakTime) {
                this.currentTrans.x += (transX / timeDiff) * t;
                this.currentTrans.y += (transY / timeDiff) * t;
                this.currentTrans.z += (transZ / timeDiff) * t;

                this.currentRot.x += (rotX / timeDiff) * t;
                this.currentRot.y += (rotY / timeDiff) * t;
                this.currentRot.z += (rotZ / timeDiff) * t;

                this.currentScale.x += (scaleX / timeDiff) * t;
                this.currentScale.y += (scaleY / timeDiff) * t;
                this.currentScale.z += (scaleZ / timeDiff) * t;
            }

            if (this.startTime > breakTime)
                this.stage++;
        }
    }

    // Applies current transformations to object
    apply() {
        this.scene.translate(this.currentTrans.x, this.currentTrans.y, this.currentTrans.z);

        this.scene.rotate(this.currentRot.x * Math.PI / 180, 1, 0, 0);
        this.scene.rotate(this.currentRot.y * Math.PI / 180, 0, 1, 0);
        this.scene.rotate(this.currentRot.z * Math.PI / 180, 0, 0, 1);

        this.scene.scale(this.currentScale.x, this.currentScale.y, this.currentScale.z);
    }
}
