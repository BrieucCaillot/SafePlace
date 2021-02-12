import ThreeObject from '../Abstract/ThreeObject'
import * as THREE from 'three'
import fragmentShader from './fragmentShader.frag'
import vertexShader from './vertexShader.vert'

export default class Particles extends ThreeObject {
  public uniforms: { [name: string]: THREE.IUniform }

  constructor() {
    super()
    // Keep context
    this.UpdateMousePos = this.UpdateMousePos.bind(this)

    this.uniforms = {
      uRows: { value: 100 },
      uColumns: { value: 100 },
      uSpacing: { value: 2 },
      uTime: { value: 0 },
      uMousePos: { value: new THREE.Vector2(0, 0) },
    }

    const bufferGeometry = new THREE.BoxBufferGeometry(1, 1, 1)
    const geometry = new THREE.InstancedBufferGeometry()
    const numPoints = this.uniforms.uRows.value * this.uniforms.uColumns.value

    Object.keys(bufferGeometry.attributes).forEach((attributeName) => {
      geometry.attributes[attributeName] = bufferGeometry.attributes[attributeName]
    })
    geometry.index = bufferGeometry.index

    const index = new Float32Array(numPoints)

    for (let i = 0; i < numPoints; i++) index[i] = i
    geometry.setAttribute('aIndex', new THREE.InstancedBufferAttribute(index, 1, false))

    const material = new THREE.RawShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: this.uniforms,
    })

    const mesh = new THREE.InstancedMesh(geometry, material, numPoints)

    const matrix = new THREE.Matrix4().compose(new THREE.Vector3(), new THREE.Quaternion(), new THREE.Vector3(1, 1, 1))
    for (let index = 0; index < numPoints; index++) mesh.setMatrixAt(index, matrix.clone())

    mesh.scale.multiplyScalar(0.023)
    this.object3d = mesh
  }

  Update() {
    this.uniforms.uTime.value++
  }

  OnMount() {
    window.addEventListener('mousemove', this.UpdateMousePos)
  }

  OnUnmount() {
    window.removeEventListener('mousemove', this.UpdateMousePos)
  }

  private UpdateMousePos({ clientX, clientY }: MouseEvent) {
    this.uniforms.uMousePos.value.set(clientX / window.innerWidth, 1 - clientY / window.innerHeight)
  }
}
