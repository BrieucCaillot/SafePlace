import * as THREE from 'three'
import ThreeObject from './Abstract/ThreeObject'

export default class Scene {
  public scene: THREE.Scene
  public renderer: THREE.WebGLRenderer
  public camera: THREE.Camera
  public objects: ThreeObject[] = []

  constructor(canvas: HTMLCanvasElement) {
    this.scene = new THREE.Scene()

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    })
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.setPixelRatio(window.devicePixelRatio)

    this.renderer.setClearColor(0x000000)

    this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000)

    this.camera.position.z = 5

    this.scene.add(this.camera)
  }

  public Update() {
    this.objects.forEach((o) => o.Update())
    this.renderer.render(this.scene, this.camera)
  }

  public Add(object3d: ThreeObject) {
    this.objects.push(object3d)
    this.scene.add(object3d.object3d)
    object3d.OnMount()
  }

  public AddSeveral(objects: ThreeObject[]) {
    objects.forEach((o) => this.Add(o))
  }

  public Remove(object3d: ThreeObject) {
    const index = this.objects.indexOf(object3d)
    if (index === -1) return
    object3d.OnUnmount()
    this.scene.remove(object3d.object3d)
    this.objects.splice(index, 1)
  }

  public CleanObjects() {
    this.objects.forEach((o) => o.OnUnmount())
    this.objects = []
  }

  public Delete() {
    this.CleanObjects()
  }
}
