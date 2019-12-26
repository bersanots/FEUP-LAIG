/**
 * MyBoard
 @constructor
**/
class MyBoard extends CGFobject {
    constructor(scene, radius) {
        super(scene);
        this.radius = radius;
        this.initMaterials();
        this.createCells(this.radius);
        this.createBoard();
        this.createPieces();
    	this.coord = [[]];
    	this.initCellCoord();
    };

    initCellCoord() {
	   	let col = 5;
        let row = 5;
        let alphabet = 'abcde'.split('');
		let alphabetBelow = 'ihgf'.split('');

        let tempCoord = {};
        let tempCoordBellow = {};
		let xPos = 18;
		let xPosBellow = 2
    	for (let x = 0; x < row; x++) {
    		this.coord[alphabet[x]] = [];
    		this.coord[alphabetBelow[x]] = [];
    		let xCoord = -this.radius*xPos;
    		let xCoordBellow = -this.radius*xPosBellow;
    		
			let yCoord = -1-x;
			
			for (let y = 1; y <= col+x; y++) {
				//if (x==0) {
					tempCoord = {x: xCoord, y: this.radius*yCoord}
					tempCoordBellow = {x: xCoordBellow, y: this.radius*yCoord}
					this.coord[alphabet[x]][y] = tempCoord;
					this.coord[alphabetBelow[x]][y] = tempCoordBellow;
					yCoord += 2;
				//}

				// if (x==1) {
				// 	tempCoord = {x: xCoord1, y: this.radius*yCoord}
				// 	this.coord[alphabet[x]][y] = tempCoord;
				// 	yCoord += 2;
				// }
			}

			xPos -= 2;
			xPosBellow += 2;
    	}

		alphabet = 'ihgf'.split('');

 		for (let x = 0; x < row - 1; x++) {

 			for (let y = 1; y <= col + x ; y++) {
 				//console.log(alphabet[x] + y);
			}
         }

         console.log(this.coord);

    }

    createCells(radius) {
        this.cell = new MyCell(this.scene, radius);  
    }

    createPieces() {
        this.cylinder = new MyCylinder(this.scene,0.3,0.3,0.1,25,25);
        this.circle = new MyCircle(this.scene, 25);
    }

    drawBoard(radius) {

		this.scene.rotate(-Math.PI/2, 0, 0, 1);

        let col = 5;
        let row = 5;
        this.scene.pushMatrix()
        for (let j = 0; j < col; j++) {
            this.scene.pushMatrix()
            for (let i = 0; i < row+j; i++) {
            	this.drawCells();
            	this.scene.translate(0, radius*2, 0);

            } 
            this.scene.popMatrix();
            this.scene.translate(1, -radius*2 + 0.5, 0);
        }
		this.scene.translate(0, radius*2, 0);
 		
 		let bottomRow = row+col - 2;
 		for (let j = 0; j < col -1 ; j++) {

 			this.scene.pushMatrix();
			for (let i = 0; i < bottomRow; i++) {
        	 	this.drawCells();
			this.scene.translate(0, radius*2, 0);
        	 }
        	this.scene.popMatrix();
        
			this.scene.translate(1, radius*2 - 0.5 , 0);
			--bottomRow;
         }

        
        
    }

    createBoard() {
        this.board_cover = new MyCell(this.scene, 5.4);

    }

    initMaterials() {

        this.white_texture = new CGFtexture(this.scene, "primitives/resources/white_texture.jpg");
        this.green_lime_texture = new CGFtexture(this.scene, "primitives/resources/green_lime.png");

        this.board_material = new CGFappearance(this.scene);
        this.board_material.setAmbient(0.15, 0.15, 0.15, 1);
        this.board_material.setDiffuse(0.5, 0.5, 0.5, 1);
        this.board_material.setSpecular(0.3, 0.3, 0.3, 1);
        this.board_material.setEmission(1, 1, 1, 1);
        this.board_material.setShininess(25);
        this.board_material.setTexture(this.white_texture);

        this.board_cell = new CGFappearance(this.scene);
        this.board_cell.setAmbient(0.15, 0.15, 0.15, 1);
        this.board_cell.setDiffuse(0.5, 0.5, 0.5, 1);
        this.board_cell.setSpecular(0.3, 0.3, 0.3, 1);
        this.board_cell.setEmission(0.3, 0.3, 0.3, 1);
        this.board_cell.setShininess(25);
        this.board_cell.setTexture(this.green_lime_texture);

        this.white_material = new CGFappearance(this.scene);
        this.white_material.setAmbient(0.15, 0.15, 0.15, 1);
        this.white_material.setDiffuse(0.5, 0.5, 0.5, 1);
        this.white_material.setSpecular(0.3, 0.3, 0.3, 1);
        this.white_material.setEmission(1, 1, 1, 1);
        this.white_material.setShininess(25);

        this.black_material = new CGFappearance(this.scene);
        this.black_material.setAmbient(0.15, 0.15, 0.15, 1);
        this.black_material.setDiffuse(0.5, 0.5, 0.5, 1);
        this.black_material.setSpecular(0.3, 0.3, 0.3, 1);
        this.black_material.setEmission(0, 0, 0, 1);
        this.black_material.setShininess(25);


    }

    drawCells() {
            this.scene.pushMatrix();
                this.board_cell.apply();
                this.cell.display();
            this.scene.popMatrix();
            }

	drawPiece(x, y, material){
		this.scene.pushMatrix();

			//this.scene.translate(-this.radius*16,this.radius*2,0);
		this.scene.translate(x, y, 0);

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
		this.scene.popMatrix();
	}

    display() {
        this.drawBoard(this.radius);
        this.scene.pushMatrix();
			
        	this.scene.translate(-5,1.5,-0.1);
            this.scene.rotate(Math.PI/2, 0, 0, 1);
            this.board_material.apply();
            this.board_cover.display();
        this.scene.popMatrix();
		//let piece = this.coord['a'][1];
//        this.drawPiece(piece.x, piece.y, this.black_material);

       //this.drawPiece(-this.radius*4, this.radius*-2, this.white_material);

//		for (var i = 1; i < this.coord["b"]["length"]; i++) {
	//	 	let piece = this.coord['b'][i];

	  //      this.drawPiece(piece.x, piece.y, this.black_material);
			
		// }

		 for (let x in this.coord) {
    		for (let y in this.coord[x]) {
        		let piece = this.coord[x][y];
				this.drawPiece(piece.x, piece.y, this.black_material);
    		}
		 }
		
		
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