import * as THREE from 'three'
import SceneLayout from '../three/SceneLayout'

export default class Events {
  public mouse: THREE.Vector2 = new THREE.Vector2(0, 0)

  constructor() {
    this.init()
  }

  /**
   * Init all events
   */
  public init() {
    this.mousemoveInit()
    this.resizeInit()
  }

  public mousemoveInit() {
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1
      this.mouse.y = -1 * ((e.clientY / window.innerHeight) * 2 - 1)
    })
  }

  public resizeInit() {
    window.addEventListener('resize', () => {
      SceneLayout().OnResize()
    })
  }
}
