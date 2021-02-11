import ThreeObject from './ThreeObject'
import * as THREE from 'three'

type Controller = (object3D: THREE.Object3D) => void

export default class CallbackObject extends ThreeObject {
  public controllers: Controller[]
  public children: CallbackObject[]

  constructor(object3d: () => THREE.Object3D, controllers: Controller[] = [], children: CallbackObject[] = []) {
    super()
    this.object3d = object3d()
    this.children = children
    this.controllers = controllers
  }

  Update() {
    this.controllers.forEach((c) => c(this.object3d))
    this.children.forEach((c) => c.Update())
  }

  OnMount() {
    this.children.forEach((c) => c.OnMount())
  }

  OnUnmount() {
    this.children.forEach((c) => c.OnUnmount())
  }
}
