/**
* MyInterface class, creating a GUI interface.
*/
class MyInterface extends CGFinterface {
    /**
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * Initializes the interface.
     * @param {CGFapplication} application
     */
    init(application) {
        super.init(application);
        // init GUI. For more information on the methods, check:
        //  http://workshop.chromeexperiments.com/examples/gui

        this.gui = new dat.GUI();

        // add a group of controls (and open/expand by defult)

        this.initKeys();

        return true;
    }

    /**
     * Adds a folder containing the IDs of the lights passed as parameter.
     * @param {array} lights
     */
    addLightsGroup(lights) {

        var group = this.gui.addFolder("Lights");
        group.open();

        // add two check boxes to the group. The identifiers must be members variables of the scene initialized in scene.init as boolean
        // e.g. this.option1=true; this.option2=false;

        for (var key in lights) {
            if (lights.hasOwnProperty(key)) {
                this.scene.lightValues[key] = lights[key][0];
                group.add(this.scene.lightValues, key);
            }
        }
    }

    /**
    * processKeyboard
    * @param event {Event}
    */
    processKeyboard(event) {
        switch (event.keyCode) {
            case (109):	// lower 'm'
                this.scene.changeMaterials();
                break;
            case (77):	// capital 'M'
                this.scene.changeMaterials();
                break;
        }
    }

    /**
     * addCameraDropDowns
     * @param selectables {selectables}
     */
    addCameraDropDowns(selectables) {
        var group = this.gui.addFolder("Views");
        group.open();
        this.addCameraSelectDropDown(selectables, group);
        //this.addSecurityCameraSelectDropDown(selectables, group);
    }

    /**
     * addCameraSelectDropDown
     * @param selectables {selectables}
     * @param group {group}
     */
    addCameraSelectDropDown(selectables, group) {
        var scene = this.scene;
        var view = group.add(scene, 'selectedView', selectables).listen();;
        view.onFinishChange(function (value) {
            scene.setNewCamera(value);
        });
        view.name('View');
    }

    /**
     * addSecurityCameraSelectDropDown
     * @param selectables {selectables}
     * @param group {group}
     */
    addSecurityCameraSelectDropDown(selectables, group) {
        var scene = this.scene;
        var camera = group.add(scene, 'selectedSecurityView', selectables);
        camera.onFinishChange(function (value) {
            scene.setNewSecurityCamera(value);
        });
        camera.name('Security Camera');
    }

    /**
     * addGameControls
     */
    addGameControls() {
        var group = this.gui.addFolder("Game controls");
        group.open();
        this.addGameModeDropdown(group);
        this.addPCLevelDropdowns(group);
        this.addStartGameButton(group);
        this.addMoveTextFields(group);
        this.addMoveButton(group);
        this.addUndoButton(group);
        this.addScoreField(group);
        //this.addViewControl(group);
    }

    /**
     * addGameModeDropdown
     * @param group {group}
     */
    addGameModeDropdown(group) {
        var scene = this.scene;
        var modes = { 'Player vs Player': 1, 'Player vs PC': 2, 'PC vs Player': 3, 'PC vs PC': 4 };
        var mode = group.add(scene, 'mode', modes);
        mode.onFinishChange(function (value) {
            scene.setGameMode(value);
        });
        mode.name('Game mode');
    }

    /**
     * addPCLevelDropdowns
     * @param group {group}
     */
    addPCLevelDropdowns(group) {
        var scene = this.scene;
        var levels = [1, 2, 3];
        var PC1 = group.add(scene, 'PC1Level', levels);
        PC1.onFinishChange(function (value) {
            scene.setPC1Level(value);
        });
        PC1.name('PC1 Level');
        var PC2 = group.add(scene, 'PC2Level', levels);
        PC2.onFinishChange(function (value) {
            scene.setPC2Level(value);
        });
        PC2.name('PC2 Level');
    }

    /**
     * addStartGameButton
     * @param group {group}
     */
    addStartGameButton(group) {
        var scene = this.scene;
        this.start = function () {
            scene.startGame();
        };
        var start = group.add(this, 'start');
        start.name('Start Game');
    }

    /**
     * addMoveTextFields
     * @param group {group}
     */
    addMoveTextFields(group) {
        var scene = this.scene;

        var fromCell = group.add(scene, 'fromCell', '').listen();
        fromCell.onFinishChange(function (value) {
            scene.setFromCell(value);
        });
        fromCell.name('From');

        var toCell = group.add(scene, 'toCell', '').listen();
        toCell.onFinishChange(function (value) {
            scene.setToCell(value);
        });
        toCell.name('To');
    }

    addViewControl(group) {
        var scene = this.scene;

        var viewAngle = group.add(scene, 'viewAngle', 0, 360).listen();
        //viewAngle.update(function (value) {
         //   scene.setViewAngle(value);
        //});
        var update = function() {
            viewAngle.viewAngle = scene.viewAngle;    
        }
        update();
        
    }

    /**
     * addMoveButton
     * @param group {group}
     */
    addMoveButton(group) {
        var scene = this.scene;
        this.move = function () {
            scene.makeMove();
        };
        var move = group.add(this, 'move');
        move.name('Move');
    }

    /**
     * addUndoButton
     * @param group {group}
     */
    addUndoButton(group) {
        var scene = this.scene;
        this.undo = function () {
            scene.undoMove();
        };
        var undo = group.add(this, 'undo');
        undo.name('Undo');
    }

    /**
     * addScoreField
     * @param group {group}
     */
    addScoreField(group) {
        var scene = this.scene;
        var score = group.add(scene, 'score', '').listen();
        score.onFinishChange(function () {
            scene.setScore(-1);
        });
        score.name('Score');
    }

    /**
     * initKeys
     */
    initKeys() {
        this.scene.gui = this;
        this.activeKeys = {};
    }

    processKeyDown(event) {
        this.activeKeys[event.code] = true;
    };

    processKeyUp(event) {
        this.activeKeys[event.code] = false;
    };

    isKeyPressed(keyCode) {
        return this.activeKeys[keyCode] || false;
    }
}