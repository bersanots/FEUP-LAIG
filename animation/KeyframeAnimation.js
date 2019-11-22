/**
 * KeyframeAnimation
 * @constructor
 */
class KeyframeAnimation extends Animation {
    constructor(instant, keyframe) {
        this.instant = instant;
        makeKeyframe(keyframe);
    }

    makeKeyframe(keyframe) {
        for (var j = 0; j < keyframe.length; j++) {

            switch (keyframe[j].nodeName) {
                case 'translate':
                    this.translate = MySceneGraph.parseCoordinates3D(keyframe[j], "");
                    break;
                case 'rotate':

                    var angle_x = MySceneGraph.reader.getFloat(keyframe[j], 'angle_x');
                    var angle_y = thisMySceneGraph.reader.getFloat(keyframe[j], 'angle_y');
                    var angle_z = MySceneGraph.reader.getFloat(keyframe[j], 'angle_z');
                    this.rotate = [angle_x, angle_y, angle_z];
                    break;
                case 'scale':
                    this.scale = MySceneGraph.parseCoordinates3D(keyframe[j], "");
                    break;
            }
        }
    }
}