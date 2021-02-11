import ThreeObject from '../Abstract/ThreeObject'
import * as THREE from 'three'
import fragmentShader from './fragmentShader.frag'
import vertexShader from './vertexShader.vert'

export default class Particles extends ThreeObject {
  constructor() {
    super()

    const bufferGeometry = new THREE.BoxBufferGeometry(1, 1, 1)
    const geometry = new THREE.InstancedBufferGeometry()
    const numPoints = 10

    Object.keys(bufferGeometry.attributes).forEach((attributeName) => {
      geometry.attributes[attributeName] = bufferGeometry.attributes[attributeName]
    })
    geometry.index = bufferGeometry.index

    const index = new Float32Array(numPoints * 3)

    for (let i = 0; i < numPoints; i++) index[i] = i
    geometry.setAttribute('aIndex', new THREE.InstancedBufferAttribute(index, 1, false))

    const uniforms = {}

    const material = new THREE.RawShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
    })

    const mesh = new THREE.InstancedMesh(geometry, material, numPoints)

    const matrix = new THREE.Matrix4().compose(new THREE.Vector3(), new THREE.Quaternion(), new THREE.Vector3(1, 1, 1))
    for (let index = 0; index < numPoints; index++) mesh.setMatrixAt(index, matrix.clone())

    this.object3d = mesh
  }
}
