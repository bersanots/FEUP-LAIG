/**
 * MyBoard
 @constructor
**/
class MyBoard extends CGFobject {
    constructor(scene, radius) {
        super(scene);
        this.scene.boardObj = this;
        this.radius = radius;
        this.initMaterials();
        this.createCells(this.radius);
        // this.createBoard();
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
            let xCoord = -this.radius * xPos;
            let xCoordBellow = -this.radius * xPosBellow;

            let yCoord = -1 - x;

            for (let y = 1; y <= col + x; y++) {
                tempCoord = { x: xCoord, y: this.radius * yCoord }
                tempCoordBellow = { x: xCoordBellow, y: this.radius * yCoord }
                this.coord[alphabet[x]][y] = tempCoord;
                this.coord[alphabetBelow[x]][y] = tempCoordBellow;
                yCoord += 2;

            }

            xPos -= 2;
            xPosBellow += 2;
        }
    }

    createCells(radius) {
        this.cell = new MyHexagon(this.scene, radius);
        this.cell.pickingEnabled = true;
    }

    createPieces() {
        this.piece = new MyPiece(this.scene);
        this.piece.pickingEnabled = true;
    }

    drawBoard(radius) {

        this.scene.rotate(-Math.PI / 2, 0, 0, 1);
        this.scene.pushMatrix();
        this.scene.translate(0,0,0.1);

            let col = 5;
            let row = 5;
            this.scene.pushMatrix()
            for (let j = 0; j < col; j++) {
                this.scene.pushMatrix()
                for (let i = 0; i < row + j; i++) {
                    this.drawCells(j, i);
                    this.scene.translate(0, radius * 2, 0);

                }
                this.scene.popMatrix();
                this.scene.translate(1, -radius * 2 + 0.5, 0);
            }
            this.scene.translate(0, radius * 2, 0);

            let bottomRow = row + col - 2;
            for (let j = 0; j < col - 1; j++) {

                this.scene.pushMatrix();
                for (let i = 0; i < bottomRow; i++) {
                    this.drawCells(col + j, i);
                    this.scene.translate(0, radius * 2, 0);
                }
                this.scene.popMatrix();

                this.scene.translate(1, radius * 2 - 0.5, 0);
                --bottomRow;
            }
        this.scene.popMatrix();

    }

    createBoard() {
        this.board_cover = new MyHexagon(this.scene, 5.4);
    }

    initMaterials() {

        this.white_texture = new CGFtexture(this.scene, "primitives/../scenes/images/white_texture.jpg");
        this.green_lime_texture = new CGFtexture(this.scene, "primitives/../scenes/images/green_lime.png");

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
        this.white_material.setEmission(0.5, 0.5, 0.5, 1);
        this.white_material.setShininess(25);

        this.black_material = new CGFappearance(this.scene);
        this.black_material.setAmbient(0.15, 0.15, 0.15, 1);
        this.black_material.setDiffuse(0.5, 0.5, 0.5, 1);
        this.black_material.setSpecular(0.3, 0.3, 0.3, 1);
        this.black_material.setEmission(0, 0, 0, 1);
        this.black_material.setShininess(25);

    }

    drawCells(row, col) {
        this.scene.pushMatrix();
            this.board_cell.apply();
            this.scene.registerForPick(row * 9 + col, this.cell);
            this.cell.display();
        this.scene.popMatrix();
    }

    drawPiece(x, y, row, col, material) {
        this.scene.pushMatrix();
            this.scene.translate(x, y, 0);
            this.scene.registerForPick(row * 9 + col + 100, this.piece);

            // Displays the current piece animation.
            if (this.animation !== undefined)
                this.animation.apply();
                
            this.piece.display(material);
        this.scene.popMatrix();
    }

    createPieceAnimation(from, to) {
        let keyframes = [];
        let translation = [to.x - from.x, to.y - from.y, 0];
        let rotation = [0, 0, 0];
        let scaling = [1, 1, 1];
        keyframes[1] = [translation, rotation, scaling];
        this.animation = new KeyframeAnimation(this.scene, keyframes);
    }

    display() {
        this.drawBoard(this.radius);
        this.scene.registerForPick(404, null);

        this.board_material.apply();
        //this.board_cover.display();

        this.scene.pushMatrix();
        this.scene.translate(9, 0.5, 0.1);
        for (let x in this.coord) {
            for (let y in this.coord[x]) {
                let piece = this.coord[x][y];
                if (this.scene.board.length !== 0 && x.length === 1) {
                    let row = x.charCodeAt(0) - 97;
                    let col = parseInt(y) - 1;
                    let cell = JSON.parse(this.scene.board)[row][col];
                    if (cell !== 0) {
                        if (this.scene.animationType === 'slide') {
                            let from = {
                                x: String.fromCharCode(this.scene.fromCell[0].charCodeAt(0) + 32),
                                y: parseInt(this.scene.fromCell[1]),
                            };
                            let to = {
                                row: this.scene.toCell[0].charCodeAt(0) - 65,
                                col: parseInt(this.scene.toCell[1]) - 1,
                            };
                            if (to.row === row && to.col === col) {
                                let prevCell = this.coord[from.x][from.y];
                                this.createPieceAnimation(prevCell, piece);
                                this.scene.animationType = '';
                            }
                        }
                        this.drawPiece(piece.x, piece.y, row, col, (cell === 1 ? this.black_material : this.white_material));
                    }
                }
            }
        }
        this.scene.popMatrix();

        this.scene.clearPickRegistration();
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