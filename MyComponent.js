/**
 * MyComponent
 * @constructor
 */
class MyComponent {
	constructor(id, transformation, animations, materials, texture, children) {
		this.id = id;
		this.materials = materials;
		this.activeMaterialId = materials[0];
		this.animations = animations;
		this.textureId = texture[0];
		this.textureS = texture[1];
		this.textureT = texture[2];
		this.childrenComponents = children['components'];
		this.childrenPrimitives = children['primitives'];

		if (transformation != null)
			this.transformMatrix = transformation;
		else {
			this.transformMatrix = mat4.create();
			mat4.identity(this.transformMatrix);
		}


	};

	addChildComponent(id) {
		this.childrenComponents.push(id);
	};

	addChildPrimitive(id) {
		this.childrenPrimitives.push(id);
	};

	addMaterial(matId) {
		this.materials.push(matId);
		if (this.activeMaterialId == null)
			this.activeMaterialId = matId;
	};

	setTexture(texId, S, T) {
		this.textureId = texId;
		this.textureS = S;
		this.textureT = T;
	};

	setActiveMaterial(matId) {
		this.activeMaterialId = matId;
	};
};