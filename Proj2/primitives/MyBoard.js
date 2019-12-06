/**
 * MyBoard
 @constructor
**/
class MyBoard extends CGFobject {
    constructor(scene) {
        super(scene);
        this.radius = .5;
        this.createBoard();
    };

    createBoard() {
        // for (var i = 0; i < 2; i++) {
            // console.log("Alabama");
            this.board = new MyCell(this.scene, this.radius);
            
        // }

    }

    drawBoard() {
        this.scene.rotate(-Math.PI/2, 0, 0, 1);
        for (let i = 0; i < 5; ++i) { 
            let j = 0;
            for (j = 0; j < 5; ++j) {
                this.drawCells();
                this.scene.translate(0, this.radius*1.74, 0);
            }

            this.scene.translate(1, -j, 0);
        }
    }

    drawCells() {
            
            this.board.display();
        }

    display() {
        this.scene.pushMatrix();
            this.drawBoard();
        this.scene.popMatrix();

    }

}