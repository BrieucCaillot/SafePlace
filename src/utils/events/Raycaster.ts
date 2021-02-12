import StandaloneEventEmitter from './StandaloneEventEmitter'
import { Object3D, Intersection, Vector2, Camera, Raycaster as ThreeRaycaster } from 'three'

export default class Raycaster extends StandaloneEventEmitter<Object3D, OrdereredIntersection> {
  private raycaster: ThreeRaycaster
  private mouse: Vector2 = new Vector2()
  private camera: Camera

  constructor(camera: Camera) {
    super()
    this.raycaster = new ThreeRaycaster()
    this.camera = camera
    this.HandleMouse = this.HandleMouse.bind(this)
  }

  protected Cast() {
    this.raycaster.setFromCamera(this.mouse, this.camera)
    const intersected = this.raycaster.intersectObjects([...this.callbackAssoc.keys()])
    for (let i = 0; i < intersected.length; i++) {
      const e = intersected[i]
      ;(<OrdereredIntersection>e).order = i
      this.Emit(e.object, <OrdereredIntersection>e)
    }
  }

  protected Start(): void {
    window.addEventListener('mousemove', this.HandleMouse)
  }
  protected Stop(): void {
    window.removeEventListener('mousemove', this.HandleMouse)
  }

  protected HandleMouse({ clientX, clientY }: MouseEvent) {
    this.mouse.x = (clientX / window.innerWidth) * 2 - 1
    this.mouse.y = -(clientY / window.innerHeight) * 2 + 1
    this.Cast()
  }
}

type OrdereredIntersection = Intersection & { order: number }
