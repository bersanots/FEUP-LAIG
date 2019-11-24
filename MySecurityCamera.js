/**
 * MySecurityCamera
 * @constructor
 * @param scene - Reference to MyScene object
 */

class MySecurityCamera extends CGFobject {
    constructor(scene) {
        super(scene);
        this.rectangle = new MyRectangle(this.scene, "securityCamera", 0.5, 1, -1, -0.5);
        this.shader = new CGFshader(this.scene.gl, "shaders/securityCamera.vert", "shaders/securityCamera.frag");
        this.shader.setUniformsValues({ uSampler2: 0, timeFactor: 0 });
    }

    display() {
        this.scene.setActiveShader(this.shader);
        this.scene.pushMatrix();
        this.scene.textureRTT.bind(0);
        this.rectangle.display();
        this.scene.textureRTT.unbind(0);
        this.scene.popMatrix();
        this.scene.setActiveShader(this.scene.defaultShader);
    }

    updateTimeFactor(t) {
        this.shader.setUniformsValues({ timeFactor: t });
    }
}
