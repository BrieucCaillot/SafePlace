precision mediump float;
precision mediump int;

uniform mat4 modelViewMatrix; 
uniform mat4 projectionMatrix;

attribute vec3 position;
attribute vec2 uv;
attribute float aIndex;

float remap(float value, float start1, float stop1, float start2, float stop2)
{
	return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
}

void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
