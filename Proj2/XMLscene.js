var DEGREE_TO_RAD = Math.PI / 180;

/**
 * XMLscene class, representing the scene that is to be rendered.
 */
class XMLscene extends CGFscene {
    /**
     * @constructor
     * @param {MyInterface} myinterface 
     */
    constructor(myinterface) {
        super();

        this.interface = myinterface;
        this.lightValues = {};
        this.selectables = [];
        this.views = " ";
    }

    /**
     * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
     * @param {CGFApplication} application
     */
    init(application) {
        super.init(application);

        this.sceneInited = false;

        this.textureRTT = new CGFtextureRTT(this, this.gl.canvas.width, this.gl.canvas.height);
        //this.securityCamera = new MySecurityCamera(this);

        this.enableTextures(true);
        this.setPickEnabled(true);

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.axis = new CGFaxis(this);
        this.setUpdatePeriod(100);

        this.gameboard = new MyGameBoard(this);

        this.viewAngle = 0;

    }

    /**
     * Initializes the scene cameras.
     */
    initCameras() {
        //Set selected cameras by default value
        this.selectedView = this.graph.def;
        //this.selectedSecurityView = this.graph.def;

        // Set active camera
        this.camera = this.graph.views[this.selectedView];
        //this.secCamera = this.graph.views[this.selectedSecurityView];
        this.interface.setActiveCamera(this.camera);
    }

    /**
     * Initializes the scene lights with the values read from the XML file.
     */
    initLights() {
        var i = 0;
        // Lights index.

        // Reads the lights from the scene graph.
        for (var key in this.graph.lights) {
            if (i >= 8)
                break;              // Only eight lights allowed by WebGL.

            if (this.graph.lights.hasOwnProperty(key)) {
                var light = this.graph.lights[key];

                this.lights[i].setPosition(light[2][0], light[2][1], light[2][2], light[2][3]);
                this.lights[i].setAmbient(light[3][0], light[3][1], light[3][2], light[3][3]);
                this.lights[i].setDiffuse(light[4][0], light[4][1], light[4][2], light[4][3]);
                this.lights[i].setSpecular(light[5][0], light[5][1], light[5][2], light[5][3]);
                this.lights[i].setConstantAttenuation(light[6][0]);
                this.lights[i].setLinearAttenuation(light[6][1]);
                this.lights[i].setQuadraticAttenuation(light[6][2]);

                if (light[1] == "spot") {
                    this.lights[i].setSpotCutOff(light[7]);
                    this.lights[i].setSpotExponent(light[8]);
                    this.lights[i].setSpotDirection(light[9][0], light[9][1], light[9][2]);
                }

                this.lights[i].setVisible(true);
                if (light[0])
                    this.lights[i].enable();
                else
                    this.lights[i].disable();

                this.lights[i].update();

                i++;
            }
        }
    }

    /**
     * Initializes the variables used for the game.
     */
    initGameValues() {
        // Set default values
        this.gameOngoing = false;
        this.PChasPlayed = false;
        this.playedRandomly = false;
        this.newPiece = true;
        this.animationType = '';
        this.PC1Level = 1;
        this.PC2Level = 1;
        this.mode = 1;
        this.fromCell = '';
        this.toCell = '';
        this.board = '';
        this.playerType1 = '';
        this.playerType2 = '';
        this.activePlayer = 1;
        this.drawCount = 0;
        this.score = '0 - 0';
        this.backupScore = '0 - 0';
        this.previousValues = [];
        this.initialTime = '';
        this.timer = '';
        this.backupTimer = '';
    }

    setDefaultAppearance() {
        this.setAmbient(0.2, 0.4, 0.8, 1.0);
        this.setDiffuse(0.2, 0.4, 0.8, 1.0);
        this.setSpecular(0.2, 0.4, 0.8, 1.0);
        this.setShininess(10.0);
    }

    /** Handler called when the graph is finally loaded. 
     * As loading is asynchronous, this may be called already after the application has started the run loop
     */
    onGraphLoaded() {
        this.axis = new CGFaxis(this, this.graph.referenceLength);

        this.gl.clearColor(this.graph.background[0], this.graph.background[1], this.graph.background[2], this.graph.background[3]);

        this.setGlobalAmbientLight(this.graph.ambient[0], this.graph.ambient[1], this.graph.ambient[2], this.graph.ambient[3]);

        this.initLights();

        // Adds lights group.
        this.interface.addLightsGroup(this.graph.lights);

        this.initCameras();

        //Add camera dropdowns
        this.interface.addCameraDropDowns(Object.keys(this.graph.views));

        //Initialize the game variables
        this.initGameValues();

        //Add game controls
        this.interface.addGameControls();

        this.sceneInited = true;
    }

    /**
     * Renders the scene.
     */
    render(camera) {
        // ---- BEGIN Background, camera and axis setup
        this.checkPCTurn();

        this.getClicks();

        // Clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        // Initialize Model-View matrix as identity (no transformation
        this.updateProjectionMatrix();
        this.loadIdentity();

        // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();

        this.camera = camera;
        this.interface.setActiveCamera(this.camera);

        this.pushMatrix();
        //this.axis.display();

        var i = 0;
        for (var key in this.lightValues) {
            if (this.lightValues.hasOwnProperty(key)) {
                if (this.lightValues[key]) {
                    this.lights[i].setVisible(true);
                    this.lights[i].enable();
                }
                else {
                    this.lights[i].setVisible(false);
                    this.lights[i].disable();
                }
                this.lights[i].update();
                i++;
            }
        }

        if (this.sceneInited) {
            // Draw axis
            this.setDefaultAppearance();

            // Real cam
            this.translate(6, -3, 6);
            this.rotate(Math.PI, 0, 1, 1);
            this.rotate(Math.PI / 4, 0, 0, 1);
            this.scale(0.6, 0.6, 0.6);

            // Displays the game board
            this.gameboard.display();

            // Displays the scene (MySceneGraph function).
            this.graph.displayScene();
        }

        this.popMatrix();
        // ---- END Background, camera and axis setup
    }

    // Updates camera
    updateCam() {
        switch (this.activePlayer) {
            case '1':
                if (this.viewAngle > 0) {
                    this.camera.orbit((0, 0, 1), -5 * DEGREE_TO_RAD);
                    this.viewAngle -= 5;
                }
                break;
            case '2':
                if (this.viewAngle < 180) {
                    this.camera.orbit((0, 0, 1), 5 * DEGREE_TO_RAD);
                    this.viewAngle += 5;
                }
                break;
        }
    }

    /**
     * Displays the scene.
     */
    display() {
        if (!this.sceneInited)
            return;

        //this.render(this.graph.views[this.selectedSecurityView]);
        //this.textureRTT.attachToFrameBuffer();
        this.render(this.graph.views[this.selectedView]);
        //this.textureRTT.detachFromFrameBuffer();
        //this.gl.disable(this.gl.DEPTH_TEST);

        if (this.gameOngoing) {
            this.updateCam();
        }

        this.interface.setActiveCamera(this.graph.views[this.camera]);

        //this.securityCamera.display();

        //this.gl.enable(this.gl.DEPTH_TEST);
    }

    /**
     * Detects clicks on the board.
     */
    getClicks() {
        if (!this.pickMode && this.pickResults !== null) {
            for (let i = 0; i < this.pickResults.length; i++) {
                const obj = this.pickResults[i][0];
                if (obj) {
                    const clickId = this.pickResults[i][1];
                    console.log(clickId);

                    if (clickId >= 100) {   //pick piece
                        if (clickId >= 1000)    //pick new one
                            this.newPiece = true;
                        else {                  // pick existing one
                            this.newPiece = false;
                            this.setFromCell(String.fromCharCode(Math.floor((clickId - 100) / 9) + 65) + ((clickId - 100) % 9 + 1));
                        }
                    }
                    else {                  //pick cell
                        this.setToCell(String.fromCharCode(Math.floor(clickId / 9) + 65) + (clickId % 9 + 1));
                        this.makeMove();
                    }
                }
            }
            this.pickResults = [];
        }
    }

    /**
     * Changes the material of each scene component.
     */
    changeMaterials() {
        for (var item in this.graph.components) {
            this.graph.components[item].activeMaterialId = this.graph.components[item].materials[this.graph.components[item].materials.indexOf(this.graph.components[item].activeMaterialId) + 1]
            if (this.graph.components[item].activeMaterialId == null)
                this.graph.components[item].activeMaterialId = this.graph.components[item].materials[0];
        }
    }

    /**
     * Sets a new active camera.
     */
    setNewCamera(select) {
        this.camera = this.graph.views[select];
        this.interface.setActiveCamera(this.camera);
    }

    /**
     * Sets a new active security camera.
     */
    setNewSecurityCamera(select) {
        this.secCamera = this.graph.views[select];
    }

    /**
     * Sets the level of the bot.
     */
    setPC1Level(level) {
        this.PC1Level = level;
    }

    /**
     * Sets the level of a second bot (if needed).
     */
    setPC2Level(level) {
        this.PC2Level = level;
    }

    /**
     * Sets a new game mode.
     */
    setGameMode(mode) {
        this.mode = mode;
    }

    /**
     * Sets the cell from where the piece is being moved.
     */
    setFromCell(cell) {
        this.fromCell = cell;
    }

    /**
     * Sets the cell to where the piece is being moved.
     */
    setToCell(cell) {
        this.toCell = cell;
    }

    /**
     * Updates the current board.
     */
    setBoard(board) {
        this.board = board;
    }

    /**
     * Updates the counter that evaluates if the match ended in a draw.
     */
    setDrawCount(drawCount) {
        this.drawCount = parseInt(drawCount);
    }

    /**
     * Updates the score according to the winner.
     */
    setScore(winner) {
        if (winner === -1) {
            this.score = this.backupScore;        //clear any additional text
            return;
        }

        let playerScores = this.score.split(' - ');

        if (!parseInt(playerScores[0]) || !parseInt(playerScores[1])) {
            this.score = this.backupScore;
            playerScores = this.score.split(' - ');
        }

        playerScores[parseInt(winner) - 1]++;
        this.score = playerScores.join(' - ');
        this.backupScore = this.score;
    }

    /**
     * Sets the time limit for each turn.
     */
    setInitialTime(time) {
        if (parseFloat(time) && !this.gameOngoing && parseFloat(time) > 0)
            this.initialTime = parseFloat(time);
        else
            this.initialTime = '';
    }

    /**
     * Updates the time remaining for the current turn.
     */
    setTimer(time) {
        if (time === -1) {
            this.timer = this.backupTimer;        //clear any additional text        
            return;
        }

        if (parseFloat(time)) {
            if (time <= 0) {
                this.timer = 0;
                if (this.gameOngoing && !this.playedRandomly) {
                    alert('Time\'s up! Playing randomly...');
                    this.playedRandomly = true;
                    setTimeout(() => {
                        this.makeMove();
                    }, 1000);
                }
            }
            else {
                this.timer = time;
                this.backupTimer = this.timer;
            }
        }
    }

    /**
     * Sets the player types, either human or computer with respective level.
     */
    setPlayerTypes(playerType1, playerType2) {
        this.playerType1 = playerType1;
        this.playerType2 = playerType2;
    }

    /**
     * Sets the number of the player with the next turn.
     */
    setActivePlayer(player) {
        this.activePlayer = player;
        setTimeout(() => {
            alert('Next player: ' + player + ' (' + (player === '1' ? 'black' : 'white') + ' pieces)');
        }, 1200);
    }

    /**
     * Sets the camera angle on an ongoing game.
     */
    setViewAngle(viewAngle) {
        this.viewAngle = viewAngle;
    }

    /**
     * Clears both cells' coordinates.
     */
    clearCells() {
        this.toCell = '';
        this.fromCell = '';
    }

    /**
     * Checks if it is the computer's turn.
     */
    checkPCTurn() {
        if (this.playerType1[0] === 'C' && !this.PChasPlayed) {
            setTimeout(() => {
                this.makeMove();
            }, 1000);
            this.PChasPlayed = true;
        }
    }

    /**
     * Creates a new animation for the current piece movement.
     */
    createPieceAnimation() {
        let keyframes = [];
        let translation = [0, 1, 0];
        let rotation = [0, 0, 0];
        let scaling = [1, 1, 1];
        keyframes[1] = [translation, rotation, scaling];
        this.animation = new KeyframeAnimation(this, keyframes);
        setTimeout(() => {
            this.animation = undefined;
        }, 1500);
    }

    /**
     * Starts a new game.
     */
    startGame() {
        let requestString = 'choose_mode_and_diff(' + this.mode + ',' + this.PC1Level + ',' + this.PC2Level + ')';
        let onSuccess = (data) => {
            this.gameOngoing = true;
            this.PChasPlayed = false;
            this.playedRandomly = false;
            let [boardAndPlayer, playerType1, playerType2] = data.target.response.split('/');
            let [board, activePlayer] = boardAndPlayer.split(/[()]/).join('').split('-');
            this.setBoard(board);
            this.setActivePlayer(activePlayer);
            this.setPlayerTypes(playerType1.split(/[()]/).join(''), playerType2.split(/[()]/).join(''));
            this.selectedView = 'board';
            this.setNewCamera('board');
            this.setViewAngle(0);
            this.timer = this.initialTime;
        };
        this.getPrologRequest(requestString, onSuccess);
    }


    /**
     * Makes a new move.
     */
    makeMove() {
        if (!this.gameOngoing) {
            alert('Select a game mode and difficulty!');
            this.clearCells();
            return;
        }

        if ((this.fromCell !== '' && this.fromCell.length !== 2) || (this.toCell !== '' && this.toCell.length !== 2)) {
            alert('Invalid cell!');
            this.clearCells();
            return;
        }

        let move;

        if (this.fromCell === '' && this.toCell !== '') {
            move = '\'' + this.toCell[0] + '\'+' + this.toCell[1];
        }
        else if (this.toCell !== '') {
            move = '\'' + this.fromCell[0] + '\'+' + this.fromCell[1] + '-' + '\'' + this.toCell[0] + '\'+' + this.toCell[1];
        }
        else if (this.playerType1[0] === 'H' && this.timer !== 0) {
            alert('Insert at least a value for the cell where the piece should be placed!');
            this.clearCells();
            return;
        }

        let requestString = 'game_cycle(' + this.board + '-' + this.activePlayer + ',\'' + this.playerType1[0] + '\'' + this.playerType1.substr(1, 2) + ',\''
            + this.playerType2[0] + '\'' + this.playerType2.substr(1, 2) + ',' + move + ',' + this.drawCount + ')';

        if (this.timer === 0) {      // if time is over, play randomly
            let randomMove;
            requestString = 'game_cycle(' + this.board + '-' + this.activePlayer + ',\'' + 'C\'-1' + ',\''
            + this.playerType2[0] + '\'' + this.playerType2.substr(1, 2) + ',' + randomMove + ',' + this.drawCount + ')';
        }

        let onSuccess = (data) => {
            let message = data.target.response.split('/');

            //on error
            if (message.length === 1) {
                alert(message[0]);
                this.clearCells();
                return;
            }

            this.previousValues.push([this.board, this.playerType1, this.playerType2, this.activePlayer, this.drawCount]);

            let [boardAndPlayer, playerType1, playerType2, drawCount, winner] = data.target.response.split('/');
            let [board, activePlayer] = boardAndPlayer.split(/[()]/).join('').split('-');

            if (this.timer === 0) {
                playerType2 = this.playerType1;
            }

            this.setBoard(board);
            this.setPlayerTypes(playerType1.split(/[()]/).join(''), playerType2.split(/[()]/).join(''));
            this.setDrawCount(drawCount.split(/[()]/).join(''));

            //animation
            //this.newPiece ? this.animationType = 'place' : this.animationType = 'slide';

            if (winner !== undefined) {
                this.setWinner(winner);
                this.timer = '';
            }
            else {
                this.setActivePlayer(activePlayer);
                if (playerType1[1] === 'C')
                    this.PChasPlayed = false;
                this.timer = this.initialTime;
                this.playedRandomly = false;
            }

            this.clearCells();
        };

        this.getPrologRequest(requestString, onSuccess);
    }

    /**
     * Reverts the last move.
     */
    undoMove() {
        if (!this.gameOngoing) {
            alert('Select a game mode and difficulty!');
            return;
        }
        else if (this.previousValues.length === 0) {
            alert('No moves have been made yet!');
            return;
        }

        // go back 2 turns if it's the human's turn and if the opponent is a bot
        if (this.playerType1[0] === 'H' && this.PChasPlayed && this.previousValues.length > 1)
            this.previousValues.pop();

        let [board, playerType1, playerType2, activePlayer, drawCount] = this.previousValues.pop();

        if (playerType1[0] === 'C')
            this.PChasPlayed = false;

        this.timer = this.initialTime;
        this.playedRandomly = false;

        this.setBoard(board);
        this.setActivePlayer(activePlayer);
        this.setPlayerTypes(playerType1, playerType2);
        this.setDrawCount(drawCount);
    }

    /**
     * Sets the game winner.
     */
    setWinner(winner) {
        this.winner = winner;
        this.gameOngoing = false;
        this.previousValues = [];
        if (winner === '0')
            setTimeout(() => {
                alert('Pieces were slided for six turns in a row. The game ended in a DRAW.');
            }, 500);
        else {
            setTimeout(() => {
                alert('The winner is Player ' + winner);
            }, 500);
            this.setScore(winner);
        }
    }

    /**
     * Updates the scene along the time.
     */
    update(t) {
        this.prevTime = this.prevTime || 0.0;
        this.deltaTime = (t - this.prevTime || 0.0) / 1000;

        for (var key in this.graph.animations) {
            this.graph.animations[key].update(this.deltaTime);
        }

        if (this.boardObj !== undefined && this.boardObj.animation !== undefined)
            this.boardObj.animation.update(this.deltaTime);

        if (this.initialTime && this.initialTime !== '')
            this.setTimer(this.timer - this.deltaTime);

        this.prevTime = t;

        //this.securityCamera.updateTimeFactor(t / 100 % 1000);
    }

    /**
     * Get the prolog request.
     */
    getPrologRequest(requestString, onSuccess, onError, port) {
        var requestPort = port || 8082
        var request = new XMLHttpRequest();
        request.open('GET', 'http://localhost:' + requestPort + '/' + requestString, true);

        request.onload = onSuccess || function (data) { console.log("Request successful. Reply: " + data.target.response); };
        request.onerror = onError || function () { console.log("Error waiting for response"); };

        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.send();
    }
}