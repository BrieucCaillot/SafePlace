import * as THREE from 'three'
import ThreeObject from './Abstract/ThreeObject'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export default class Scene {
  public controls: OrbitControls
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
    this.controls = new OrbitControls(this.camera, canvas)

    this.camera.position.z = 5

    this.scene.add(this.camera)
  }

  public Update() {
    this.objects.forEach((o) => o.Update())
    this.renderer.render(this.scene, this.camera)
  }

  public Add(threeObject: ThreeObject) {
    this.objects.push(threeObject)
    this.scene.add(threeObject.object3d)
    threeObject.OnMount()
  }

  public AddSeveral(objects: ThreeObject[]) {
    objects.forEach((o) => this.Add(o))
  }

  public Remove(threeObject: ThreeObject) {
    const index = this.objects.indexOf(threeObject)
    if (index === -1) return
    threeObject.OnUnmount()
    this.scene.remove(threeObject.object3d)
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
