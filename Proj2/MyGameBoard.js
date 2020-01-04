/**
* MyGameBoard
* @constructor
*/
class MyGameBoard extends CGFobject {
    constructor(scene) {
      super(scene);
      // board comp
      // piece holder
      this.cylinder = new MyCylinder(this.scene, 0.1, 0.1, 5, 100, 100);
      this.cylinder_holder = new MyCylinder(this.scene, 0.4, 0.4, 5, 100, 100);
      this.connector = new MySphere(this.scene, 0.1, 100, 100);
      this.connector_holder = new MySphere(this.scene, 0.4, 100, 100);
      this.hexagon = new MyHexagon(this.scene, 1);

      this.blackMaterial = new CGFappearance(this.scene);
      this.blackMaterial.setShininess(1.0);
      this.blackMaterial.setAmbient(0.0, 0.0, 0.0, 1.0);
      this.blackMaterial.setDiffuse(0, 0, 0, 1.0);
      this.blackMaterial.setSpecular(0, 0, 0, 1.0);
      this.blackMaterial.setShininess(10.0);

      this.whiteMaterial = new CGFappearance(this.scene);
      this.whiteMaterial.setShininess(0.1);
      this.whiteMaterial.setAmbient(0.9, 0.9, 0.9, 0.1);
      this.whiteMaterial.setDiffuse(0.9, 0.9, 0.9, 0.1);
      this.whiteMaterial.setSpecular(0.9, 0.9, 0.9, 0.1);
      this.whiteMaterial.setEmission(0.9, 0.9, 0.9, 0.1);
    }

    drawHexagon(x) {
      this.whiteMaterial.apply();

      this.scene.pushMatrix();
        this.scene.rotate(-Math.PI/2, 0, 1, 0);
        this.scene.scale(5,5,5);
        this.hexagon.display();
      this.scene.popMatrix();
    
      this.blackMaterial.apply();
      //board side 1
      this.scene.pushMatrix();
        this.scene.rotate(0, 1, 0, 0);
        this.scene.translate(0,-4.3,-2.5);
        x ? this.cylinder.display() : this.cylinder_holder.display();
      this.scene.popMatrix();

      //board side 2
      this.scene.pushMatrix();
        this.scene.rotate(0, 1, 0, 0);
        this.scene.translate(0,4.3,-2.5);
        x ? this.cylinder.display() : this.cylinder_holder.display();
      this.scene.popMatrix();
      
      // //board side 3
      this.scene.pushMatrix();
        this.scene.rotate(Math.PI/3, 1, 0, 0);
        this.scene.translate(0,4.3,-2.5);
        x ? this.cylinder.display() : this.cylinder_holder.display();
      this.scene.popMatrix();
      
      // //board side 4
      this.scene.pushMatrix();
        this.scene.rotate(Math.PI/3, 1, 0, 0);
        this.scene.translate(0,-4.3,-2.5);
        x ? this.cylinder.display() : this.cylinder_holder.display();
      this.scene.popMatrix();

      // //board side 5
      this.scene.pushMatrix();
        this.scene.rotate(-Math.PI/3, 1, 0, 0);
        this.scene.translate(0,-4.3,-2.5);
        x ? this.cylinder.display() : this.cylinder_holder.display();
      this.scene.popMatrix();
      
      // //board side 6
      this.scene.pushMatrix();
        this.scene.rotate(-Math.PI/3, 1, 0, 0);
        this.scene.translate(0,4.3,-2.5);
        x ? this.cylinder.display() : this.cylinder_holder.display();
      this.scene.popMatrix();

      // board connector 1
      this.blackMaterial.apply();
      this.scene.pushMatrix();
        this.scene.translate(0,4.3,2.48);
        x ? this.connector.display() : this.connector_holder.display();
      this.scene.popMatrix();

       // board connector 2
      this.scene.pushMatrix();
        this.scene.translate(0,4.3,-2.48);
        x ? this.connector.display() : this.connector_holder.display();
      this.scene.popMatrix(); 

      // board connector 3
      this.scene.pushMatrix();
        this.scene.translate(0,-4.3,-2.48);
        x ? this.connector.display() : this.connector_holder.display();
      this.scene.popMatrix(); 

      // board connector 4
      this.scene.pushMatrix();
        this.scene.translate(0,-4.3,2.48);
        x ? this.connector.display() : this.connector_holder.display();
      this.scene.popMatrix(); 

       // board connector 5
      this.scene.pushMatrix();
        this.scene.translate(0,0,4.96);
        x ? this.connector.display() : this.connector_holder.display();
      this.scene.popMatrix(); 

       // board connector 6
      this.scene.pushMatrix();
        this.scene.translate(0,0,-4.96);
        x ? this.connector.display() : this.connector_holder.display();
      this.scene.popMatrix(); 
    }

    display() {
      this.scene.pushMatrix();
      
        this.scene.rotate(Math.PI / 2, 0, 1, 0);
        this.scene.translate(-5, 1, 7);
        this.scene.scale(1.1, 1.1, 1.1);

        this.scene.pushMatrix();
          this.drawHexagon(true);
        this.scene.popMatrix();

        this.scene.pushMatrix();
          this.scene.translate(0, 5.5, 0);
          this.scene.scale(0.2, 0.2, 0.2);
          this.drawHexagon(false);
        this.scene.popMatrix();

        this.scene.pushMatrix();
          this.scene.translate(0, -5.5, 0);
          this.scene.scale(0.2, 0.2, 0.2);
          this.drawHexagon(false);
          this.blackMaterial.apply();
        this.scene.popMatrix();

      this.scene.popMatrix();
    }
  
}