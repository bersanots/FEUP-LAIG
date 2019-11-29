#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform float timeFactor;

void main() {
    vec4 color = texture2D(uSampler, vTextureCoord);

	//horizontal lines
    if (mod(vTextureCoord.y * 100.0 + timeFactor, 2.0) > 1.0)
        color = vec4(color.rgb * 2.0, 1.0);

	float shadow_radius = 0.5;
	vec2 shadow_center = vec2(0.5, 0.5);

	//radial gradient
    gl_FragColor = vec4(color.rgb * (shadow_radius - sqrt((vTextureCoord.x - shadow_center.x) * (vTextureCoord.x - shadow_center.x) + (vTextureCoord.y - shadow_center.y) * (vTextureCoord.y - shadow_center.y))), 1.0);
}