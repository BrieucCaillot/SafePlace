precision mediump float;
precision mediump int;

uniform mat4 modelViewMatrix; 
uniform mat4 projectionMatrix;

attribute vec3 position;
attribute vec2 uv;

uniform float uRows;
uniform float uColumns;
uniform float uSpacing;
uniform float uTime;
attribute float aIndex;

float remap(float value, float start1, float stop1, float start2, float stop2)
{
	return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
}

void main() {
	vec2 offset = vec2(
		mod(aIndex, uRows),
		floor(aIndex / uColumns)
	);
	offset -= vec2(uRows, uColumns) / 2.;
	offset *= uSpacing;

	gl_Position = projectionMatrix * modelViewMatrix * vec4(position + vec3(offset.x, offset.y, 0.), 1.0);
}
