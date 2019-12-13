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
            this.board = new MyCell(this.scene, this.radius);
            
        // }

    }

    drawBoard() {
        this.scene.rotate(-Math.PI/2, 0, 0, 1);

        let i = 5;
        let a = false;
        // do{
        //     let j = 0;
        //     for (j; j < i-1; ++j) {
        //         this.drawCells();
        //         this.scene.translate(0, this.radius*1.74, 0);
        //     }
        //     this.scene.translate(1, -j*0.9, 0);
        //     (i==9)? a = true: a = false;
        //     a ? ++i : --i;
        //     console.log(i);
        // }while(i != 5);

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