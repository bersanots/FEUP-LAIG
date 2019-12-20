/**
 * MyBoard
 @constructor
**/
class MyBoard extends CGFobject {
    constructor(scene, radius) {
        super(scene);
        this.radius = radius;
        console.log(radius);
        this.createBoard();
    };

    createBoard() {
            this.cell = new MyCell(this.scene, this.radius);
            

    }

    drawBoard() {
        this.scene.rotate(-Math.PI/2, 0, 0, 1);
        
        let col = 5;
        let row = 5;
        let tmp = 0;
        this.scene.pushMatrix()
        for (let j = 0; j < col; j++) {
            this.scene.pushMatrix()
            for (let i = 0; i < row+j; i++) {
            	this.drawCells();
            	this.scene.translate(0, this.radius*2, 0);

            } 
            this.scene.popMatrix();
            this.scene.translate(1, -this.radius*2 + 0.5, 0);
        }
		this.scene.translate(0, this.radius*2, 0);
 		
 		let bottomRow = row+col - 2;
 		for (let j = 0; j < col -1 ; j++) {

 			this.scene.pushMatrix();
			for (let i = 0; i < bottomRow; i++) {
        	 	this.drawCells();
			this.scene.translate(0, this.radius*2, 0);
        	 }
        	this.scene.popMatrix();
        
			this.scene.translate(1, this.radius*2 - 0.5 , 0);
			--bottomRow;
 		}
		this.scene.popMatrix();
    }
    

    drawCells() {
            
            this.cell.display();
        }

    display() {
        this.scene.pushMatrix();
            this.drawBoard();
        this.scene.popMatrix();

    }

    updateTexCoords(length_s, length_t) {
		this.texCoords = [];

		for (var i = 0; i <= this.slices; i++) {
			for (var j = 0; j <= this.stacks; j++) {
				this.texCoords.push((i / this.slices) / length_s, (j / this.stacks) / length_t);
			}
		}

		this.updateTexCoordsGLBuffers();
	}

}