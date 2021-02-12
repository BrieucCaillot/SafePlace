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
uniform vec2 uMousePos;

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
	float dist = step(length(offset / vec2(uRows, uColumns) - uMousePos), .1) * 50.;
	offset -= vec2(uRows, uColumns) / 2.;
	offset *= uSpacing;

	gl_Position = projectionMatrix * modelViewMatrix * vec4(position + vec3(offset.x, offset.y, dist), 1.0);
}
