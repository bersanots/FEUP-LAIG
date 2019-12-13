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
        this.securityCamera = new MySecurityCamera(this);

        this.enableTextures(true);

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.axis = new CGFaxis(this);
        this.setUpdatePeriod(100);
    }

    /**
     * Initializes the scene cameras.
     */
    initCameras() {
        //Set selected cameras by default value
        this.selectedView = this.graph.def;
        this.selectedSecurityView = this.graph.def;

        // Set active camera
        this.camera = this.graph.views[this.selectedView];
        this.secCamera = this.graph.views[this.selectedSecurityView];
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
        this.difficulty = 1;
        this.mode = 1;
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
        this.axis.display();

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

            // Displays the scene (MySceneGraph function).
            this.graph.displayScene();
        }

        this.popMatrix();
        // ---- END Background, camera and axis setup
    }

    /**
     * Displays the scene.
     */
    display() {
        if (!this.sceneInited)
            return;

        this.render(this.graph.views[this.selectedSecurityView]);
        this.textureRTT.attachToFrameBuffer();
        this.render(this.graph.views[this.selectedView]);
        this.textureRTT.detachFromFrameBuffer();

        this.gl.disable(this.gl.DEPTH_TEST);

        this.securityCamera.display();

        this.gl.enable(this.gl.DEPTH_TEST);
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
     * Sets a new game difficulty.
     */
    setGameDifficulty(diff) {
        //if (!gameStarted)
        this.difficulty = diff;
    }

    /**
     * Sets a new game mode.
     */
    setGameMode(mode) {
        //if (!gameStarted)
        this.mode = mode;
    }

    /**
     * Sets a new game difficulty.
     */
    startGame() {
        //send request
        const Http = new XMLHttpRequest();
        const url = 'http://localhost:8082/choose_mode_and_diff(' + this.mode + ',' + this.difficulty + ')';
        Http.open("GET", url);
        Http.send();
        const result = Http.responseText;
        this.setWinner(result);
    }

    /**
     * Sets the game winner.
     */
    setWinner(winner) {
        this.winner = winner;
        alert('The winner is Player ' + winner);
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

        this.prevTime = t;

        this.securityCamera.updateTimeFactor(t / 100 % 1000);
    }
}