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

      this.createPieces();

      this.blackMaterial = new CGFappearance(this.scene);
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

      this.white_material_piece = new CGFappearance(this.scene);
      this.white_material_piece.setAmbient(0.15, 0.15, 0.15, 1);
      this.white_material_piece.setDiffuse(0.5, 0.5, 0.5, 1);
      this.white_material_piece.setSpecular(0.3, 0.3, 0.3, 1);
      this.white_material_piece.setEmission(0.5, 0.5, 0.5, 1);
      this.white_material_piece.setShininess(25);

      this.black_material_piece = new CGFappearance(this.scene);
      this.black_material_piece.setAmbient(0.15, 0.15, 0.15, 1);
      this.black_material_piece.setDiffuse(0.5, 0.5, 0.5, 1);
      this.black_material_piece.setSpecular(0.3, 0.3, 0.3, 1);
      this.black_material_piece.setEmission(0, 0, 0, 1);
      this.black_material_piece.setShininess(25);
    }

    // auxiliary pieces on the side of the board
    createPieces() {
      this.piece = new MyPiece(this.scene);
      this.piece.pickingEnabled = true;
    }

    drawPieces(player, material) {
      this.scene.pushMatrix();
        this.scene.translate(-1, 0, -5.25);
        this.scene.scale(5, 5, 5);
        this.scene.rotate(Math.PI/2, 0, 1, 0);
        this.scene.rotate(Math.PI, 0, 0, 1);
      for (let i = 0; i < 2; i++) {
        this.scene.translate(0.7, 0, 0);
        this.scene.registerForPick(i + player * 1000, this.piece);
        this.piece.display(material);
      }
      this.scene.popMatrix();
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
        this.scene.translate(-5, 5, 7);
        this.scene.scale(1.1, 1.1, 1.1);

        this.scene.pushMatrix();
          this.drawHexagon(true);
        this.scene.popMatrix();

        this.scene.pushMatrix();
          this.scene.translate(0, 5.5, 0);
          this.scene.scale(0.2, 0.2, 0.2);
          this.drawHexagon(false);
          this.drawPieces(2, this.white_material_piece);
        this.scene.popMatrix();

        this.scene.registerForPick(404, null);

        this.scene.pushMatrix();
          this.scene.translate(0, -5.5, 0);
          this.scene.scale(0.2, 0.2, 0.2);
          this.drawHexagon(false);
          this.drawPieces(1, this.black_material_piece);
          this.blackMaterial.apply();
        this.scene.popMatrix();

      this.scene.popMatrix();

      this.scene.clearPickRegistration();
    }
  
}