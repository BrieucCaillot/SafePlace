  
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 modelMatrix;

attribute vec3 position;
attribute vec3 normal;

varying vec3 vNormal;

void main() {
  vNormal = vec3(modelMatrix * vec4(normalize(normal), 0.));
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
