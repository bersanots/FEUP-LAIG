/**
 * Board
 @constructor
**/
class Board extends CGFobject {
    constructor(scene) {
        super(scene);

        this.createBoard();
    };

    createBoard() {
        this.board = new MyPlane(this.scene, 20, 20);
    }

    display() {
        this.scene.pushMatrix();
        this.board.display();
        this.scene.popMatrix();
    }

}