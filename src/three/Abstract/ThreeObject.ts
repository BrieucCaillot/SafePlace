import * as THREE from 'three'

export default class ThreeObject {
  public object3d: THREE.Object3D

  public OnMount(): void {}

  public OnUnmount(): void {}

  public Update(): void {}
}
