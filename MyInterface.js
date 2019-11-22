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
     processKeyboard(event){
     switch (event.keyCode)
	   {
	    case (109):	// lower 'm'
			this.scene.changeMaterials();
			break;
		case (77):	// capital 'M'
			this.scene.changeMaterials();
			break;
	   }
    }
    
    /**
     * addCameraSelectDropDown
     * @param selectables {selectables}
     */
    addCameraSelectDropDown(selectables){
        var scene = this.scene;
        var group = this.gui.add(scene, 'views', selectables);
        group.onFinishChange(function(value){
            scene.setNewCamera(value);
        });
    }

    /**
     * addSecurityCameraSelectDropDown
     * @param selectables {selectables}
     */
    addSecurityCameraSelectDropDown(selectables){
        var scene = this.scene;
        var group = this.gui.add(scene, 'views', selectables);
        group.onFinishChange(function(value){
            scene.setNewSecurityCamera(value);
        });
    }

    /**
     * initKeys
     */
    initKeys() {
        this.scene.gui=this;
        this.activeKeys={};
    }

    processKeyDown(event) {
        this.activeKeys[event.code]=true;
    };

    processKeyUp(event) {
        this.activeKeys[event.code]=false;
    };

    isKeyPressed(keyCode) {
        return this.activeKeys[keyCode] || false;
    }
}