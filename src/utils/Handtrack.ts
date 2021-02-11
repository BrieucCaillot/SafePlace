//
import { Hands } from '@mediapipe/hands/hands'
import { Camera } from '@mediapipe/camera_utils/camera_utils'

type HandLandmarks = Array<{ x: number; y: number }>
type Handedness = { index: number; label: 'Right' | 'Left'; score: number }

type DoubleHandtrackResult = {
  multiHandLandmarks: [HandLandmarks, HandLandmarks]
  multiHandedness: [Handedness, Handedness]
}
type SingleHandtrackResult = {
  multiHandLandmarks: [HandLandmarks]
  multiHandedness: [Handedness]
}
type EmptyHandtrackResult = {
  multiHandLandmarks: [HandLandmarks]
  multiHandedness: [Handedness]
}
type HandtrackResult = DoubleHandtrackResult | SingleHandtrackResult | EmptyHandtrackResult

type HandtrackCallback = (r: HandtrackResult) => void

export default class Handtrack {
  private camera: any
  private hands: any
  private callbacks: HandtrackCallback[] = []
  private isLoaded: boolean = false
  public get IsLoaded(): boolean {
    return this.isLoaded
  }

  constructor(videoElement: HTMLVideoElement) {
    this.hands = new Hands({
      locateFile: (file: string) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.1/${file}`
      },
    })

    this.camera = new Camera(videoElement, {
      onFrame: () => {
        this.hands.send({ image: videoElement })
      },
      width: 1280,
      height: 720,
    })
  }

  public Load(): Promise<Handtrack> {
    return new Promise<Handtrack>((res) => {
      const image = new Image()
      image.src = './images/empty.png'
      image.addEventListener('load', () => {
        this.hands.send({ image })
      })
      this.hands.onResults((r: HandtrackResult) => this.CameraCallback(r, res))
    })
  }

  public StartCamera(): void {
    if (!this.isLoaded) throw new Error('Handtrack is not loaded')
    this.camera.start()
  }

  public Subscribe(cb: HandtrackCallback): void {
    this.callbacks.push(cb)
  }

  public Unsubscribe(cb: HandtrackCallback): void {
    const index = this.callbacks.indexOf(cb)
    if (index > -1) this.callbacks.splice(index, 1)
  }

  private CameraCallback(result: HandtrackResult, onLoad: (h: Handtrack) => void): void {
    this.callbacks.forEach((c) => c(result))
    if (this.isLoaded) return
    this.isLoaded = true
    onLoad(this)
  }
}
