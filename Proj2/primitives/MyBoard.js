/**
 * MyBoard
 @constructor
**/
class MyBoard extends CGFobject {
    constructor(scene) {
        super(scene);

        this.createBoard();
    };

    createBoard() {
        this.board = new MyPlane(this.scene, 5, 5);
    }

    display() {
        this.scene.pushMatrix();
        this.board.display();
        this.scene.popMatrix();
    }

}