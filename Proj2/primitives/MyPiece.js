/**
 * MyPiece
 * @constructor
 */

class MyPiece extends CGFobject {

    constructor(scene) {
        super(scene);
        this.cylinder = new MyCylinder(this.scene, 0.3, 0.3, 0.1, 25, 25);
        this.circle = new MyCircle(this.scene, 25);
        this.initBuffers();
    }

    display(material) {
      this.scene.pushMatrix();
          this.scene.scale(0.3, 0.3, 1);
          this.scene.rotate(Math.PI, 0, 1, 0);
          material.apply();
          this.circle.display();
      this.scene.popMatrix();

      this.cylinder.display();
      
      //Top cover
      this.scene.pushMatrix();
          this.scene.translate(0, 0, 0.1);
          this.scene.scale(0.3, 0.3, 1);
          material.apply();
          this.circle.display();
      this.scene.popMatrix();
    }
  }