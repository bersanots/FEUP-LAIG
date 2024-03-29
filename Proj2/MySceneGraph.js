var DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var SCENE_INDEX = 0;
var VIEWS_INDEX = 1;
var GLOBALS_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var MATERIALS_INDEX = 5;
var TRANSFORMATIONS_INDEX = 6;
var ANIMATIONS_INDEX = 7
var PRIMITIVES_INDEX = 8;
var COMPONENTS_INDEX = 9;

/**
 * MySceneGraph class, representing the scene graph.
 */
class MySceneGraph {
    /**
     * @constructor
     */
    constructor(filename, scene) {
        this.loadedOk = null;

        // Establish bidirectional references between scene and graph.
        this.scene = scene;
        scene.graph = this;

        this.nodes = [];

        this.idRoot = null;                    // The id of the root element.

        this.axisCoords = [];
        this.axisCoords['x'] = [1, 0, 0];
        this.axisCoords['y'] = [0, 1, 0];
        this.axisCoords['z'] = [0, 0, 1];

        // File reading 
        this.reader = new CGFXMLreader();

        /*
         * Read the contents of the xml file, and refer to this class for loading and error handlers.
         * After the file is read, the reader calls onXMLReady on this object.
         * If any error occurs, the reader calls onXMLError on this object, with an error message
         */
        this.reader.open('scenes/' + filename, this);
    }

    /*
     * Callback to be executed after successful reading
     */
    onXMLReady() {
        this.log("XML Loading finished.");
        var rootElement = this.reader.xmlDoc.documentElement;

        // Here should go the calls for different functions to parse the various blocks
        var error = this.parseXMLFile(rootElement);

        if (error != null) {
            this.onXMLError(error);
            return;
        }

        this.loadedOk = true;

        // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
        this.scene.onGraphLoaded();
    }

    /**
     * Parses the XML file, processing each block.
     * @param {XML root element} rootElement
     */
    parseXMLFile(rootElement) {
        if (rootElement.nodeName != "lxs")
            return "root tag <lxs> missing";

        var nodes = rootElement.children;

        // Reads the names of the nodes to an auxiliary buffer.
        var nodeNames = [];

        for (var i = 0; i < nodes.length; i++) {
            nodeNames.push(nodes[i].nodeName);
        }

        var error;

        // Processes each node, verifying errors.

        // <scene>
        var index;
        if ((index = nodeNames.indexOf("scene")) == -1)
            return "tag <scene> missing";
        else {
            if (index != SCENE_INDEX)
                this.onXMLMinorError("tag <scene> out of order " + index);

            //Parse scene block
            if ((error = this.parseScene(nodes[index])) != null)
                return error;
        }

        // <views>
        if ((index = nodeNames.indexOf("views")) == -1)
            return "tag <views> missing";
        else {
            if (index != VIEWS_INDEX)
                this.onXMLMinorError("tag <views> out of order");

            //Parse views block
            if ((error = this.parseView(nodes[index])) != null)
                return error;
        }

        // <globals>
        if ((index = nodeNames.indexOf("globals")) == -1)
            return "tag <globals> missing";
        else {
            if (index != GLOBALS_INDEX)
                this.onXMLMinorError("tag <globals> out of order");

            //Parse globals block
            if ((error = this.parseGlobals(nodes[index])) != null)
                return error;
        }

        // <lights>
        if ((index = nodeNames.indexOf("lights")) == -1)
            return "tag <lights> missing";
        else {
            if (index != LIGHTS_INDEX)
                this.onXMLMinorError("tag <lights> out of order");

            //Parse lights block
            if ((error = this.parseLights(nodes[index])) != null)
                return error;
        }
        // <textures>
        if ((index = nodeNames.indexOf("textures")) == -1)
            return "tag <textures> missing";
        else {
            if (index != TEXTURES_INDEX)
                this.onXMLMinorError("tag <textures> out of order");

            //Parse textures block
            if ((error = this.parseTextures(nodes[index])) != null)
                return error;
        }

        // <materials>
        if ((index = nodeNames.indexOf("materials")) == -1)
            return "tag <materials> missing";
        else {
            if (index != MATERIALS_INDEX)
                this.onXMLMinorError("tag <materials> out of order");

            //Parse materials block
            if ((error = this.parseMaterials(nodes[index])) != null)
                return error;
        }

        // <animations>
        if ((index = nodeNames.indexOf("animations")) == -1)
            return "tag <animations> missing";
        else {
            if (index != ANIMATIONS_INDEX)
                this.onXMLMinorError("tag <animations> out of order");

            //Parse animations block
            if ((error = this.parseAnimations(nodes[index])) != null)
                return error;
        }


        // <transformations>
        if ((index = nodeNames.indexOf("transformations")) == -1)
            return "tag <transformations> missing";
        else {
            if (index != TRANSFORMATIONS_INDEX)
                this.onXMLMinorError("tag <transformations> out of order");

            //Parse transformations block
            if ((error = this.parseTransformations(nodes[index])) != null)
                return error;
        }

        // <primitives>
        if ((index = nodeNames.indexOf("primitives")) == -1)
            return "tag <primitives> missing";
        else {
            if (index != PRIMITIVES_INDEX)
                this.onXMLMinorError("tag <primitives> out of order");

            //Parse primitives block
            if ((error = this.parsePrimitives(nodes[index])) != null)
                return error;
        }

        // <components>
        if ((index = nodeNames.indexOf("components")) == -1)
            return "tag <components> missing";
        else {
            if (index != COMPONENTS_INDEX)
                this.onXMLMinorError("tag <components> out of order");

            //Parse components block
            if ((error = this.parseComponents(nodes[index])) != null)
                return error;
        }
        this.log("all parsed");
    }

    /**
     * Parses the <scene> block. 
     * @param {scene block element} sceneNode
     */
    parseScene(sceneNode) {

        // Get root of the scene.
        var root = this.reader.getString(sceneNode, 'root')
        if (root == null)
            return "no root defined for scene";

        this.idRoot = root;

        // Get axis length        
        var axis_length = this.reader.getFloat(sceneNode, 'axis_length');
        if (axis_length == null)
            this.onXMLMinorError("no axis_length defined for scene; assuming 'length = 1'");

        this.referenceLength = axis_length || 1;

        this.log("Parsed scene");

        return null;
    }

    /**
     * Parses the <views> block.
     * @param {view block element} viewsNode
     */
    parseView(viewsNode) {

        // Get default view
        this.def = this.reader.getString(viewsNode, 'default');
        if (this.def == null)
            return "no default view defined";

        var children = viewsNode.children;

        this.views = [];
        var numViews = 0;

        var grandChildren = [];
        var nodeNames = [];

        // Any number of views.
        for (var i = 0; i < children.length; i++) {

            // Storing view information
            var global = [];
            var attributeNames = [];
            var attributeTypes = [];

            //Check type of view
            if (children[i].nodeName != "perspective" && children[i].nodeName != "ortho") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }
            else {
                attributeNames.push(...["from", "to"]);
                attributeTypes.push(...["position", "position"]);
            }

            // Get id of the current view.
            var viewId = this.reader.getString(children[i], 'id');
            if (viewId == null)
                return "no ID defined for view";

            // Checks for repeated IDs.
            if (this.views[viewId] != null)
                return "ID must be unique for each view (conflict: ID = " + viewId + ")";

            // Get 'near' attribute
            var near = this.reader.getFloat(children[i], 'near');
            if (!(near != null && !isNaN(near))) {
                this.onXMLMinorError("unable to parse value component of the 'near' field for ID = " + viewId);
                continue;
            }

            // Get 'far' attribute
            var far = this.reader.getFloat(children[i], 'far');
            if (!(far != null && !isNaN(far))) {
                this.onXMLMinorError("unable to parse value component of the 'far' field for ID = " + viewId);
                continue;
            }

            //Add attributes and type name to view info
            global.push(near);
            global.push(far);
            global.push(children[i].nodeName);

            grandChildren = children[i].children;
            // Specifications for the current view.

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            for (var j = 0; j < attributeNames.length; j++) {
                var attributeIndex = nodeNames.indexOf(attributeNames[j]);

                if (attributeIndex != -1 && attributeTypes[j] == "position") {
                    var aux = this.parseCoordinates3D(grandChildren[attributeIndex], "view position for ID" + viewId);

                    if (!Array.isArray(aux))
                        return aux;

                    global.push(aux);
                }
                else
                    return "view " + attributeNames[i] + " undefined for ID = " + viewId;
            }

            // Get the additional attributes of both view types
            if (children[i].nodeName == "perspective") {
                var angle = this.reader.getFloat(children[i], 'angle');
                if (!(angle != null && !isNaN(angle)))
                    return "unable to parse angle of the view for ID = " + viewId;

                global.push(...[angle]);
                this.views[viewId] = new CGFcamera(angle, near, far, global[3], global[4]);
            }
            else {
                var left = this.reader.getFloat(children[i], 'left');
                if (!(left != null && !isNaN(left)))
                    return "unable to parse left of the view for ID = " + viewId;

                var right = this.reader.getFloat(children[i], 'right');
                if (!(right != null && !isNaN(right)))
                    return "unable to parse right of the view for ID = " + viewId;

                var top = this.reader.getFloat(children[i], 'top');
                if (!(top != null && !isNaN(top)))
                    return "unable to parse top of the view for ID = " + viewId;

                var bottom = this.reader.getFloat(children[i], 'bottom');
                if (!(bottom != null && !isNaN(bottom)))
                    return "unable to parse bottom of the view for ID = " + viewId;

                var upIndex = nodeNames.indexOf("up");

                // Retrieves the 'up' coordinates
                var upView = [];
                if (upIndex != -1) {
                    var aux = this.parseCoordinates3D(grandChildren[upIndex], "up view for ID " + viewId);
                    if (!Array.isArray(aux))
                        return aux;

                    upView = aux;
                }
                else
                    upView = [0, 1, 0];

                global.push(...[left, right, top, bottom, upView]);
                this.views[viewId] = new CGFcameraOrtho(left, right, bottom, top, near, far, global[3], global[4], global[9]);
            }

            numViews++;
        }

        if (numViews == 0)
            return "at least one view must be defined";

        this.log("Parsed views");

        return null;
    }

    /**
     * Parses the <globals> node.
     * @param {globals block element} globalsNode
     */
    parseGlobals(globalsNode) {

        var children = globalsNode.children;

        this.ambient = [];
        this.background = [];

        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        var ambientIndex = nodeNames.indexOf("ambient");
        var backgroundIndex = nodeNames.indexOf("background");

        var color = this.parseColor(children[ambientIndex], "ambient");
        if (!Array.isArray(color))
            return color;
        else
            this.ambient = color;

        color = this.parseColor(children[backgroundIndex], "background");
        if (!Array.isArray(color))
            return color;
        else
            this.background = color;

        this.log("Parsed globals");

        return null;
    }

    /**
     * Parses the <light> node.
     * @param {lights block element} lightsNode
     */
    parseLights(lightsNode) {
        var children = lightsNode.children;

        this.lights = [];
        var numLights = 0;

        var grandChildren = [];
        var nodeNames = [];

        // Any number of lights.
        for (var i = 0; i < children.length; i++) {

            // Storing light information
            var global = [];
            var attributeNames = [];
            var attributeTypes = [];

            //Check type of light
            if (children[i].nodeName != "omni" && children[i].nodeName != "spot") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }
            else {
                attributeNames.push(...["location", "ambient", "diffuse", "specular"]);
                attributeTypes.push(...["position", "color", "color", "color"]);
            }

            // Get id of the current light.
            var lightId = this.reader.getString(children[i], 'id');
            if (lightId == null)
                return "no ID defined for light";

            // Checks for repeated IDs.
            if (this.lights[lightId] != null)
                return "ID must be unique for each light (conflict: ID = " + lightId + ")";

            // Light enable/disable
            var enableLight = true;
            var aux = this.reader.getBoolean(children[i], 'enabled');
            if (!(aux != null && !isNaN(aux) && (aux == true || aux == false)))
                this.onXMLMinorError("unable to parse value component of the 'enable light' field for ID = " + lightId + "; assuming 'value = 1'");
            else
                enableLight = aux;

            //Add enabled boolean and type name to light info
            global.push(enableLight);
            global.push(children[i].nodeName);

            grandChildren = children[i].children;
            // Specifications for the current light.

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            for (var j = 0; j < attributeNames.length; j++) {
                var attributeIndex = nodeNames.indexOf(attributeNames[j]);

                if (attributeIndex != -1) {
                    if (attributeTypes[j] == "position")
                        var aux = this.parseCoordinates4D(grandChildren[attributeIndex], "light position for ID" + lightId);
                    else
                        var aux = this.parseColor(grandChildren[attributeIndex], attributeNames[j] + " illumination for ID" + lightId);

                    if (!Array.isArray(aux))
                        return aux;

                    global.push(aux);
                }
                else
                    return "light " + attributeNames[i] + " undefined for ID = " + lightId;
            }

            var attIndex = nodeNames.indexOf("attenuation");

            // Retrieves the light attenuation
            var lightAtt = [];

            if (attIndex != -1) {
                // constant attenuation
                var constant = this.reader.getFloat(grandChildren[attIndex], 'constant');
                if (!(constant != null && !isNaN(constant) && (constant == 0 || constant == 1)))
                    return "unable to parse constant value of the light attenuation for ID " + lightId;

                // linear attenuation
                var linear = this.reader.getFloat(grandChildren[attIndex], 'linear');
                if (!(linear != null && !isNaN(linear) && (linear == 0 || linear == 1)))
                    return "unable to parse linear value of the light attenuation for ID " + lightId;

                // quadratic attenuation
                var quadratic = this.reader.getFloat(grandChildren[attIndex], 'quadratic');
                if (!(quadratic != null && !isNaN(quadratic) && (quadratic == 0 || quadratic == 1)))
                    return "unable to parse quadratic value of the light attenuation for ID " + lightId;

                var aux = [];
                aux.push(...[constant, linear, quadratic]);

                if (aux.reduce((a, b) => a + b, 0) != 1)
                    return "either none or more than one light attenuation type was defined for ID = " + lightId;

                lightAtt.push(...[constant, linear, quadratic]);
            }
            else
                return "light attenuation undefined for ID = " + lightId;

            global.push(lightAtt);

            // Gets the additional attributes of the spot light
            if (children[i].nodeName == "spot") {
                var angle = this.reader.getFloat(children[i], 'angle');
                if (!(angle != null && !isNaN(angle)))
                    return "unable to parse angle of the light for ID = " + lightId;

                var exponent = this.reader.getFloat(children[i], 'exponent');
                if (!(exponent != null && !isNaN(exponent)))
                    return "unable to parse exponent of the light for ID = " + lightId;

                var targetIndex = nodeNames.indexOf("target");

                // Retrieves the light target
                var targetLight = [];
                if (targetIndex != -1) {
                    var aux = this.parseCoordinates3D(grandChildren[targetIndex], "target light for ID " + lightId);
                    if (!Array.isArray(aux))
                        return aux;

                    targetLight = aux;
                }
                else
                    return "light target undefined for ID = " + lightId;

                global.push(...[angle, exponent, targetLight]);
            }

            this.lights[lightId] = global;
            numLights++;
        }

        if (numLights == 0)
            return "at least one light must be defined";
        else if (numLights > 8)
            this.onXMLMinorError("too many lights defined; WebGL imposes a limit of 8 lights");

        this.log("Parsed lights");
        return null;
    }

    /**
     * Parses the <textures> block. 
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode) {

        //For each texture in textures block, check ID and file URL

        var children = texturesNode.children;

        this.textures = [];
        var numTextures = 0;

        // Any number of textures.
        for (var i = 0; i < children.length; i++) {

            // Storing texture information
            var global = [];

            // Get id of the current texture.
            var textureId = this.reader.getString(children[i], 'id');
            if (textureId == null)
                return "no ID defined for texture";

            // Checks for repeated IDs.
            if (this.textures[textureId] != null)
                return "ID must be unique for each texture (conflict: ID = " + textureId + ")";

            // Texture file
            var file = this.reader.getString(children[i], 'file');
            if (file == null)
                return "no file defined for texture";

            this.textures[textureId] = new CGFtexture(this.scene, file);
            numTextures++;
        }

        if (numTextures == 0)
            return "at least one texture must be defined";

        this.log("Parsed textures");
        return null;
    }

    /**
     * Parses the <materials> node.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) {
        var children = materialsNode.children;

        this.materials = [];
        var numMaterials = 0;

        var grandChildren = [];
        var nodeNames = [];

        // Any number of materials.
        for (var i = 0; i < children.length; i++) {

            // Storing material information
            var global = [];
            var attributeNames = [];
            var attributeTypes = [];

            if (children[i].nodeName != "material") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }
            else {
                attributeNames.push(...["emission", "ambient", "diffuse", "specular"]);
                attributeTypes.push(...["color", "color", "color", "color"]);
            }

            // Get id of the current material.
            var materialId = this.reader.getString(children[i], 'id');
            if (materialId == null)
                return "no ID defined for material";

            // Checks for repeated IDs.
            if (this.materials[materialId] != null)
                return "ID must be unique for each material (conflict: ID = " + materialId + ")";

            // Material shininess
            var shininess = this.reader.getString(children[i], 'shininess');
            if (shininess == null)
                return "no shininess defined for material";

            //Add shininess
            global.push(shininess);

            grandChildren = children[i].children;
            // Specifications for the current material.

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            for (var j = 0; j < attributeNames.length; j++) {
                var attributeIndex = nodeNames.indexOf(attributeNames[j]);

                if (attributeIndex != -1 && attributeTypes[j] == "color") {
                    var aux = this.parseColor(grandChildren[attributeIndex], "material color for ID" + materialId);

                    if (!Array.isArray(aux))
                        return aux;

                    global.push(aux);
                }
                else
                    return "material " + attributeNames[i] + " undefined for ID = " + materialId;
            }

            var newMaterial = new CGFappearance(this.scene);
            newMaterial.setShininess(shininess);
            newMaterial.setEmission(global[1][0], global[1][1], global[1][2], global[1][3]);
            newMaterial.setAmbient(global[2][0], global[2][1], global[2][2], global[2][3]);
            newMaterial.setDiffuse(global[3][0], global[3][1], global[3][2], global[3][3]);
            newMaterial.setSpecular(global[4][0], global[4][1], global[4][2], global[4][3]);
            newMaterial.setTextureWrap('REPEAT', 'REPEAT');

            this.materials[materialId] = newMaterial;
            numMaterials++;
        }

        if (numMaterials == 0)
            return "at least one material must be defined";

        this.log("Parsed materials");
        return null;
    }

    /**
     * Parses the <animations> block.
     * @param {animations block element} animationsNode
     */
    parseAnimations(animationsNode) {
        var children = animationsNode.children;

        this.animations = [];

        var numKeyframes = 0;

        var grandChildren = [];

        // Any number of animations.
        for (var i = 0; i < children.length; i++) {
            var keyframes = [];
            numKeyframes = 0;

            if (children[i].nodeName != "animation") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current animation.
            var animationId = this.reader.getString(children[i], 'id');
            if (animationId == null)
                return "no ID defined for animation";

            // Checks for repeated IDs.
            if (this.animations[animationId] != null)
                return "ID must be unique for each animation (conflict: ID = " + animationId + ")";

            grandChildren = children[i].children;

            // Specifications for the current animation.

            if (grandChildren.length == 0)
                return "at least one keyframe must be defined inside this block";

            // Any number of keyframes.
            for (var j = 0; j < grandChildren.length; j++) {

                if (grandChildren[j].nodeName != "keyframe") {
                    this.onXMLMinorError("unknown tag <" + grandChildren[j].nodeName + ">");
                    continue;
                }

                var instant = this.reader.getFloat(grandChildren[j], 'instant');

                var grandGrandChildren = grandChildren[j].children;

                if (grandGrandChildren.length != 3)
                    return "wrong number of transformation types for animation ID " + animationId;

                // translation
                if (grandGrandChildren[0].nodeName != "translate") {
                    this.onXMLMinorError("unknown or out of order tag <" + grandGrandChildren[0].nodeName + ">");
                    continue;
                }

                var translation = this.parseCoordinates3D(grandGrandChildren[0], "translate transformation for animation ID " + animationId);

                // rotation
                if (grandGrandChildren[1].nodeName != "rotate") {
                    this.onXMLMinorError("unknown or out of order tag <" + grandGrandChildren[1].nodeName + ">");
                    continue;
                }

                var rotation = [];
                var angle_x = this.reader.getFloat(grandGrandChildren[1], 'angle_x');
                var angle_y = this.reader.getFloat(grandGrandChildren[1], 'angle_y');
                var angle_z = this.reader.getFloat(grandGrandChildren[1], 'angle_z');

                if (!(angle_x != null && !isNaN(angle_x)) && !(angle_y != null && !isNaN(angle_y)) && !(angle_z != null && !isNaN(angle_z)))
                    return "unable to parse rotation angles for animation ID = " + animationId;

                rotation.push(angle_x);
                rotation.push(angle_y);
                rotation.push(angle_z);

                // scaling
                if (grandGrandChildren[2].nodeName != "scale") {
                    this.onXMLMinorError("unknown or out of order tag <" + grandGrandChildren[2].nodeName + ">");
                    continue;
                }

                var scaling = this.parseCoordinates3D(grandGrandChildren[2], "scale transformation for animation ID " + animationId);

                keyframes[instant] = [translation, rotation, scaling];
                numKeyframes++;
            }

            if (numKeyframes == 0)
                return "at least one keyframe must be defined";

            var animation = new KeyframeAnimation(this.scene, keyframes);

            this.animations[animationId] = animation;
        }

        this.log("Parsed animations");
        return null;
    }

    /**
     * Parses the <transformations> block.
     * @param {transformations block element} transformationsNode
     */
    parseTransformations(transformationsNode) {
        var children = transformationsNode.children;

        this.transformations = [];
        var numTransformations = 0;

        var grandChildren = [];

        // Any number of transformations.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "transformation") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current transformation.
            var transformationId = this.reader.getString(children[i], 'id');
            if (transformationId == null)
                return "no ID defined for transformation";

            // Checks for repeated IDs.
            if (this.transformations[transformationId] != null)
                return "ID must be unique for each transformation (conflict: ID = " + transformationId + ")";

            grandChildren = children[i].children;
            // Specifications for the current transformation.

            if (grandChildren.length == 0)
                return "at least one transformation type must be defined inside this block";

            var transfMatrix = this.makeMatrix(grandChildren, transformationId);
            this.transformations[transformationId] = transfMatrix;
            numTransformations++;
        }
        if (numTransformations == 0)
            return "at least one transformation must be defined";

        this.log("Parsed transformations");
        return null;
    }

    makeMatrix(nodes, transformationId) {
        var transfMatrix = mat4.create();
        for (var j = 0; j < nodes.length; j++) {

            switch (nodes[j].nodeName) {
                case 'translate':
                    var coordinates = this.parseCoordinates3D(nodes[j], "translate transformation for ID " + transformationId);
                    if (!Array.isArray(coordinates))
                        return coordinates;

                    transfMatrix = mat4.translate(transfMatrix, transfMatrix, coordinates);

                    break;
                case 'scale':
                    var coordinates = this.parseCoordinates3D(nodes[j], "scale transformation for ID " + transformationId);
                    if (!Array.isArray(coordinates))
                        return coordinates;

                    transfMatrix = mat4.scale(transfMatrix, transfMatrix, coordinates);
                    break;
                case 'rotate':
                    var angle = this.reader.getFloat(nodes[j], 'angle');
                    if (!(angle != null && !isNaN(angle)))
                        return "unable to parse rotation angle for ID = " + transformationId;

                    var axis = this.reader.getString(nodes[j], 'axis');
                    if (!(axis != null && (axis == "x" || axis == "y" || axis == "z")))
                        return "unable to parse rotation axis for ID = " + transformationId;

                    transfMatrix = mat4.rotate(transfMatrix, transfMatrix, angle * DEGREE_TO_RAD, this.axisCoords[axis]);
                    break;
            }
        }
        return transfMatrix;
    }

    /**
     * Parses the <primitives> block.
     * @param {primitives block element} primitivesNode
     */
    parsePrimitives(primitivesNode) {
        var children = primitivesNode.children;

        this.primitives = [];
        var numPrimitives;

        var grandChildren = [];
        var grandgrandChildren = [];

        // Any number of primitives.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "primitive") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current primitive.
            var primitiveId = this.reader.getString(children[i], 'id');
            if (primitiveId == null)
                return "no ID defined for primitive";

            // Checks for repeated IDs.
            if (this.primitives[primitiveId] != null)
                return "ID must be unique for each primitive (conflict: ID = " + primitiveId + ")";

            grandChildren = children[i].children;

            // Validate the primitive type
            if (grandChildren.length != 1 ||
                (grandChildren[0].nodeName != 'rectangle' && grandChildren[0].nodeName != 'triangle' &&
                    grandChildren[0].nodeName != 'cylinder' && grandChildren[0].nodeName != 'sphere' &&
                    grandChildren[0].nodeName != 'torus' && grandChildren[0].nodeName != 'plane' &&
                    grandChildren[0].nodeName != 'patch' && grandChildren[0].nodeName != 'cylinder2' &&
                    grandChildren[0].nodeName != 'hexagon' && grandChildren[0].nodeName != 'circle' &&
                    grandChildren[0].nodeName != 'board')) {
                return "There must be exactly 1 primitive type (rectangle, triangle, cylinder, sphere, torus, plane, patch, cylinder2, hexagon, circle or board)"
            }

            // Specifications for the current primitive.
            var primitiveType = grandChildren[0].nodeName;

            // Retrieves the primitive coordinates.
            if (primitiveType == 'rectangle') {
                // x1
                var x1 = this.reader.getFloat(grandChildren[0], 'x1');
                if (!(x1 != null && !isNaN(x1)))
                    return "unable to parse x1 of the primitive coordinates for ID = " + primitiveId;

                // y1
                var y1 = this.reader.getFloat(grandChildren[0], 'y1');
                if (!(y1 != null && !isNaN(y1)))
                    return "unable to parse y1 of the primitive coordinates for ID = " + primitiveId;

                // x2
                var x2 = this.reader.getFloat(grandChildren[0], 'x2');
                if (!(x2 != null && !isNaN(x2) && x2 > x1))
                    return "unable to parse x2 of the primitive coordinates for ID = " + primitiveId;

                // y2
                var y2 = this.reader.getFloat(grandChildren[0], 'y2');
                if (!(y2 != null && !isNaN(y2) && y2 > y1))
                    return "unable to parse y2 of the primitive coordinates for ID = " + primitiveId;

                var rect = new MyRectangle(this.scene, x1, x2, y1, y2);

                this.primitives[primitiveId] = rect;
            }
            else if (primitiveType == 'triangle') {
                // x1
                var x1 = this.reader.getFloat(grandChildren[0], 'x1');
                if (!(x1 != null && !isNaN(x1)))
                    return "unable to parse x1 of the primitive coordinates for ID = " + primitiveId;

                // y1
                var y1 = this.reader.getFloat(grandChildren[0], 'y1');
                if (!(y1 != null && !isNaN(y1)))
                    return "unable to parse y1 of the primitive coordinates for ID = " + primitiveId;

                // z1
                var z1 = this.reader.getFloat(grandChildren[0], 'z1');
                if (!(z1 != null && !isNaN(z1)))
                    return "unable to parse z1 of the primitive coordinates for ID = " + primitiveId;

                // x2
                var x2 = this.reader.getFloat(grandChildren[0], 'x2');
                if (!(x2 != null && !isNaN(x2)))
                    return "unable to parse x2 of the primitive coordinates for ID = " + primitiveId;

                // y2
                var y2 = this.reader.getFloat(grandChildren[0], 'y2');
                if (!(y2 != null && !isNaN(y2)))
                    return "unable to parse y2 of the primitive coordinates for ID = " + primitiveId;

                // z2
                var z2 = this.reader.getFloat(grandChildren[0], 'z2');
                if (!(z2 != null && !isNaN(z2)))
                    return "unable to parse z2 of the primitive coordinates for ID = " + primitiveId;

                // x3
                var x3 = this.reader.getFloat(grandChildren[0], 'x3');
                if (!(x3 != null && !isNaN(x3)))
                    return "unable to parse x3 of the primitive coordinates for ID = " + primitiveId;

                // y3
                var y3 = this.reader.getFloat(grandChildren[0], 'y3');
                if (!(y3 != null && !isNaN(y3)))
                    return "unable to parse y3 of the primitive coordinates for ID = " + primitiveId;

                // z3
                var z3 = this.reader.getFloat(grandChildren[0], 'z3');
                if (!(z3 != null && !isNaN(z3)))
                    return "unable to parse z3 of the primitive coordinates for ID = " + primitiveId;

                var tri = new MyTriangle(this.scene, x1, x2, x3, y1, y2, y3, z1, z2, z3);

                this.primitives[primitiveId] = tri;
            }
            else if (primitiveType == 'cylinder' || primitiveType == 'cylinder2') {
                // base
                var base = this.reader.getFloat(grandChildren[0], 'base');
                if (!(base != null && !isNaN(base) && base >= 0))
                    return "unable to parse base of the primitive coordinates for ID = " + primitiveId;

                // top
                var top = this.reader.getFloat(grandChildren[0], 'top');
                if (!(top != null && !isNaN(top) && top >= 0))
                    return "unable to parse top of the primitive coordinates for ID = " + primitiveId;

                // height
                var height = this.reader.getFloat(grandChildren[0], 'height');
                if (!(height != null && !isNaN(height) && height > 0))
                    return "unable to parse height of the primitive coordinates for ID = " + primitiveId;

                // slices
                var slices = this.reader.getInteger(grandChildren[0], 'slices');
                if (!(slices != null && !isNaN(slices) && slices > 0))
                    return "unable to parse slices of the primitive coordinates for ID = " + primitiveId;

                // stacks
                var stacks = this.reader.getInteger(grandChildren[0], 'stacks');
                if (!(stacks != null && !isNaN(stacks) && stacks > 0))
                    return "unable to parse stacks of the primitive coordinates for ID = " + primitiveId;

                var cyl = (primitiveType == 'cylinder') ? new MyCylinder(this.scene, base, top, height, slices, stacks) : new MyCylinder2(this.scene, base, top, height, slices, stacks);

                this.primitives[primitiveId] = cyl;
            }
            else if (primitiveType == 'sphere') {
                // radius
                var radius = this.reader.getFloat(grandChildren[0], 'radius');
                if (!(radius != null && !isNaN(radius) && radius >= 0))
                    return "unable to parse radius of the primitive coordinates for ID = " + primitiveId;

                // slices
                var slices = this.reader.getInteger(grandChildren[0], 'slices');
                if (!(slices != null && !isNaN(slices) && slices > 0))
                    return "unable to parse slices of the primitive coordinates for ID = " + primitiveId;

                // stacks
                var stacks = this.reader.getInteger(grandChildren[0], 'stacks');
                if (!(stacks != null && !isNaN(stacks) && stacks > 0))
                    return "unable to parse stacks of the primitive coordinates for ID = " + primitiveId;

                var sphere = new MySphere(this.scene, radius, slices, stacks);

                this.primitives[primitiveId] = sphere;
            }
            else if (primitiveType == 'torus') {
                // inner
                var inner = this.reader.getFloat(grandChildren[0], 'inner');
                if (!(inner != null && !isNaN(inner) && inner >= 0))
                    return "unable to parse inner of the primitive coordinates for ID = " + primitiveId;

                // outer
                var outer = this.reader.getFloat(grandChildren[0], 'outer');
                if (!(outer != null && !isNaN(outer) && outer >= 0))
                    return "unable to parse outer of the primitive coordinates for ID = " + primitiveId;

                // slices
                var slices = this.reader.getInteger(grandChildren[0], 'slices');
                if (!(slices != null && !isNaN(slices) && slices > 0))
                    return "unable to parse slices of the primitive coordinates for ID = " + primitiveId;

                // loops
                var loops = this.reader.getInteger(grandChildren[0], 'loops');
                if (!(loops != null && !isNaN(loops) && loops > 0))
                    return "unable to parse loops of the primitive coordinates for ID = " + primitiveId;

                var torus = new MyTorus(this.scene, inner, outer, slices, loops);

                this.primitives[primitiveId] = torus;
            }
            else if (primitiveType == 'plane') {
                var npartsU = this.reader.getInteger(grandChildren[0], 'npartsU');
                if (!(npartsU != null && !isNaN(npartsU) && npartsU >= 0))
                    return "unable to parse npartsU of the primitive coordinates for ID = " + primitiveId;

                var npartsV = this.reader.getInteger(grandChildren[0], 'npartsV');
                if (!(npartsV != null && !isNaN(npartsV) && npartsV >= 0))
                    return "unable to parse npartsV of the primitive coordinates for ID = " + primitiveId;

                var plane = new MyPlane(this.scene, npartsU, npartsV);

                this.primitives[primitiveId] = plane;
            }

            else if (primitiveType == 'patch') {
                var npointsU = this.reader.getInteger(grandChildren[0], 'npointsU');
                if (!(npointsU != null && !isNaN(npointsU) && npointsU >= 0))
                    return "unable to parse npointsU of the primitive coordinates for ID = " + primitiveId;

                var npointsV = this.reader.getInteger(grandChildren[0], 'npointsV');
                if (!(npointsV != null && !isNaN(npointsV) && npointsV >= 0))
                    return "unable to parse npointsV of the primitive coordinates for ID = " + primitiveId;

                var npartsU = this.reader.getInteger(grandChildren[0], 'npartsU');
                if (!(npartsU != null && !isNaN(npartsU) && npartsU >= 0))
                    return "unable to parse npartsU of the primitive coordinates for ID = " + primitiveId;

                var npartsV = this.reader.getInteger(grandChildren[0], 'npartsV');
                if (!(npartsV != null && !isNaN(npartsV) && npartsV >= 0))
                    return "unable to parse npartsV of the primitive coordinates for ID = " + primitiveId;

                grandgrandChildren = grandChildren[0].children;

                if (grandgrandChildren.length != npointsU * npointsV)
                    return "number of control points doesn't correspond to the npointsU and npointsV provided";

                var controlPoints = [];

                for (var j = 0; j < grandgrandChildren.length; j++) {

                    if (grandgrandChildren[j].nodeName != "controlpoint") {
                        this.onXMLMinorError("unknown tag <" + grandgrandChildren[j].nodeName + ">");
                        continue;
                    }

                    var position = [];

                    // xx
                    var xx = this.reader.getFloat(grandgrandChildren[j], 'xx');
                    if (!(xx != null && !isNaN(xx)))
                        return "unable to parse x-coordinate of the control point";

                    // yy
                    var yy = this.reader.getFloat(grandgrandChildren[j], 'yy');
                    if (!(yy != null && !isNaN(yy)))
                        return "unable to parse y-coordinate of the control point";

                    // zz
                    var zz = this.reader.getFloat(grandgrandChildren[j], 'zz');
                    if (!(zz != null && !isNaN(zz)))
                        return "unable to parse z-coordinate of the control point";

                    position.push(...[xx, yy, zz]);

                    if (!Array.isArray(position))
                        return position;

                    controlPoints.push(position);
                }

                var patch = new MyPatch(this.scene, npointsU, npointsV, npartsU, npartsV, controlPoints);

                this.primitives[primitiveId] = patch;
            }
            else if (primitiveType == 'board') {
                var radius = this.reader.getFloat(grandChildren[0], 'radius');
                var board = new MyBoard(this.scene, radius);
                this.primitives[primitiveId] = board;
            }
            else if (primitiveType == 'hexagon') {
                var radius = this.reader.getFloat(grandChildren[0], 'radius');
                var hexagon = new MyHexagon(this.scene, radius);
                this.primitives[primitiveId] = hexagon;
            }
            else if (primitiveType == 'circle') {
                var radius = this.reader.getFloat(grandChildren[0], 'radius');
                var circle = new MyCircle(this.scene, radius);
                this.primitives[primitiveId] = circle;
            }
            else {
                this.onXMLMinorError("unknown primitive <" + primitiveType + ">");
            }
            numPrimitives++;
        }

        if (numPrimitives == 0)
            return "at least one primitive must be defined";

        this.log("Parsed primitives");
        return null;
    }

    /**
   * Parses the <components> block.
   * @param {components block element} componentsNode
   */
    parseComponents(componentsNode) {
        var children = componentsNode.children;

        this.components = [];

        var grandChildren = [];
        var grandgrandChildren = [];
        var nodeNames = [];

        // Any number of components.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "component") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current component.
            var componentId = this.reader.getString(children[i], 'id');
            if (componentId == null)
                return "no ID defined for componentId";

            // Checks for repeated IDs.
            if (this.components[componentId] != null)
                return "ID must be unique for each component (conflict: ID = " + componentId + ")";

            grandChildren = children[i].children;

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            var transformationIndex = nodeNames.indexOf("transformation");
            var animationIndex = nodeNames.indexOf("animationref");
            var materialsIndex = nodeNames.indexOf("materials");
            var textureIndex = nodeNames.indexOf("texture");
            var childrenIndex = nodeNames.indexOf("children");

            // Transformation
            if (transformationIndex == -1)
                return "tag <transformation> missing for component ID " + componentId;

            grandgrandChildren = grandChildren[transformationIndex].children;

            var transformation = null;

            if (grandgrandChildren.length != 0) {
                if (grandgrandChildren[0].nodeName == "transformationref") {
                    var refId = this.reader.getString(grandgrandChildren[0], 'id');

                    if (refId == null)
                        return "no ID defined for transformationref";

                    if ((transformation = this.transformations[refId]) == null)
                        return "transformation " + refId + " does not exist";
                }
                else {
                    var transfMatrix = this.makeMatrix(grandgrandChildren, componentId);
                    transformation = transfMatrix;
                }
            }

            // Animation
            var animation = null;

            if (animationIndex != -1) {
                var refId = this.reader.getString(grandChildren[animationIndex], 'id');

                if (refId == null)
                    return "no ID defined for animationref";

                if ((animation = this.animations[refId]) == null)
                    return "animation " + refId + " does not exist";
            }

            // Materials
            if (materialsIndex == -1)
                return "tag <materials> missing for component ID " + componentId;

            grandgrandChildren = grandChildren[materialsIndex].children;

            var materials = [];

            for (var j = 0; j < grandgrandChildren.length; j++) {

                if (grandgrandChildren[j].nodeName != "material") {
                    this.onXMLMinorError("unknown tag <" + grandgrandChildren[j].nodeName + ">");
                    continue;
                }

                var materialId = this.reader.getString(grandgrandChildren[j], 'id');

                if (materialId == null)
                    return "no ID defined for material";

                if (this.materials[materialId] == null && materialId != "inherit")
                    return "material " + materialId + " does not exist";

                materials.push(materialId);
            }

            if (materials.length == 0)
                return "at least one material must be defined";


            // Texture
            if (textureIndex == -1)
                return "tag <texture> missing for component ID " + componentId;

            var texture = [];

            var textureId = this.reader.getString(grandChildren[textureIndex], 'id');

            if (textureId == null)
                return "no ID defined for texture";

            if (this.textures[textureId] == null && textureId != "inherit" && textureId != "none")
                return "texture " + textureId + " does not exist";

            var length_s = this.reader.getFloat(grandChildren[textureIndex], 'length_s', false);
            var length_t = this.reader.getFloat(grandChildren[textureIndex], 'length_t', false);

            if (textureId == "inherit" || textureId == "none") {
                if (length_s != null || length_t != null)
                    this.onXMLMinorError("length_s and length_t were defined but no texture id was provided");
            }
            else {
                if (length_s == null || length_t == null)
                    return "no length_s or length_t was defined for the provided texture id";
            }

            texture.push(textureId, length_s, length_t);

            // Children
            if (childrenIndex == -1)
                return "tag <children> missing for component ID " + componentId;

            grandgrandChildren = grandChildren[childrenIndex].children;

            var comp_children = [];
            comp_children['components'] = [];
            comp_children['primitives'] = [];
            var child;

            for (var j = 0; j < grandgrandChildren.length; j++) {
                if (grandgrandChildren[j].nodeName == "componentref") {
                    var componentRefId = this.reader.getString(grandgrandChildren[j], 'id');

                    if (componentRefId == null)
                        return "no ID defined for componentref";

                    if ((child = this.components[componentRefId]) == null)
                        return "component " + componentRefId + " does not exist";

                    comp_children['components'].push(child);
                }
                else if (grandgrandChildren[j].nodeName == "primitiveref") {
                    var primitiveRefId = this.reader.getString(grandgrandChildren[j], 'id');

                    if (primitiveRefId == null)
                        return "no ID defined for primitiveref";

                    if ((child = this.primitives[primitiveRefId]) == null)
                        return "primitive " + primitiveRefId + " does not exist";

                    comp_children['primitives'].push(child);
                }
                else
                    this.onXMLMinorError("unknown tag <" + grandgrandChildren[j].nodeName + ">");
            }

            if (comp_children['components'].length == 0 && comp_children['primitives'].length == 0)
                return "component " + componentId + " must have at least one child";


            // Create component
            var component = new MyComponent(componentId, transformation, animation, materials, texture, comp_children);

            this.components[componentId] = component;
        }

        this.log("Parsed components");
        return null;
    }


    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates3D(node, messageError) {
        var position = [];

        // x
        var x = this.reader.getFloat(node, 'x');
        if (!(x != null && !isNaN(x)))
            return "unable to parse x-coordinate of the " + messageError;

        // y
        var y = this.reader.getFloat(node, 'y');
        if (!(y != null && !isNaN(y)))
            return "unable to parse y-coordinate of the " + messageError;

        // z
        var z = this.reader.getFloat(node, 'z');
        if (!(z != null && !isNaN(z)))
            return "unable to parse z-coordinate of the " + messageError;

        position.push(...[x, y, z]);

        return position;
    }

    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates4D(node, messageError) {
        var position = [];

        //Get x, y, z
        position = this.parseCoordinates3D(node, messageError);

        if (!Array.isArray(position))
            return position;


        // w
        var w = this.reader.getFloat(node, 'w');
        if (!(w != null && !isNaN(w)))
            return "unable to parse w-coordinate of the " + messageError;

        position.push(w);

        return position;
    }

    /**
     * Parse the color components from a node
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseColor(node, messageError) {
        var color = [];

        // R
        var r = this.reader.getFloat(node, 'r');
        if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
            return "unable to parse R component of the " + messageError;

        // G
        var g = this.reader.getFloat(node, 'g');
        if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
            return "unable to parse G component of the " + messageError;

        // B
        var b = this.reader.getFloat(node, 'b');
        if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
            return "unable to parse B component of the " + messageError;

        // A
        var a = this.reader.getFloat(node, 'a');
        if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
            return "unable to parse A component of the " + messageError;

        color.push(...[r, g, b, a]);

        return color;
    }

    /*
     * Callback to be executed on any read error, showing an error on the console.
     * @param {string} message
     */
    onXMLError(message) {
        console.error("XML Loading Error: " + message);
        this.loadedOk = false;
    }

    /**
     * Callback to be executed on any minor error, showing a warning on the console.
     * @param {string} message
     */
    onXMLMinorError(message) {
        console.warn("Warning: " + message);
    }

    /**
     * Callback to be executed on any message.
     * @param {string} message
     */
    log(message) {
        console.log("   " + message);
    }

    /**
     * Processes each node of the scene graph
     */
    processNode(componentId, materialId, textureId, length_s, length_t) {
        //check if id exists
        if (this.components[componentId] == null)
            return "component " + componentId + " does not exist";

        var currentNode = this.components[componentId];

        //get material
        var currMaterialId = currentNode.activeMaterialId;

        if (currMaterialId == 'inherit')
            currMaterialId = materialId;

        var currMaterial = this.materials[currMaterialId];

        //get texture
        var currTexture;
        var currTextureId = currentNode.textureId;
        var currTextureS = currentNode.textureS;
        var currTextureT = currentNode.textureT;

        if (currTextureId == 'inherit') {
            currTextureId = textureId;
            currTextureS = length_s;
            currTextureT = length_t;
        }

        if (currTextureId == 'none')
            currTexture = null;
        else
            currTexture = this.textures[currTextureId];

        //apply material
        currMaterial.setTexture(currTexture);
        currMaterial.apply();

        //get transformation matrix
        this.scene.multMatrix(currentNode.transformMatrix);

        //apply animation
        var nodeAnimation = currentNode.animation;
        if (nodeAnimation != null) {
            nodeAnimation.apply();
        }

        //loop children
        //if component -> processNode
        for (let i = 0; i < currentNode.childrenComponents.length; i++) {
            this.scene.pushMatrix();
            this.processNode(currentNode.childrenComponents[i].id, currMaterialId, currTextureId, currTextureS, currTextureT);
            this.scene.popMatrix();
        }

        this.scene.registerForPick(404, null);

        //if primitive -> display primitive
        for (let i = 0; i < currentNode.childrenPrimitives.length; i++) {
            if (currTextureId != 'none')
                currentNode.childrenPrimitives[i].updateTexCoords(currTextureS, currTextureT);
            currentNode.childrenPrimitives[i].display();
        }
    }

    /**
     * Displays the scene, processing each node, starting in the root node.
     */
    displayScene() {
        // Start display loop for transversing the scene graph
        this.processNode(this.idRoot, this.components[this.idRoot].activeMaterialId, this.components[this.idRoot].textureId,
            this.components[this.idRoot].textureS, this.components[this.idRoot].textureT);
    }
}