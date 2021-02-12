//
import { Hands } from '@mediapipe/hands/hands'
import { Camera } from '@mediapipe/camera_utils/camera_utils'
import StandaloneEventEmitter from './StandaloneEventEmitter'

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
  multiHandLandmarks: undefined
  multiHandedness: undefined
}

export type HandtrackResult = DoubleHandtrackResult | SingleHandtrackResult | EmptyHandtrackResult

export default class Handtrack extends StandaloneEventEmitter<'all', HandtrackResult> {
  private camera: any
  private hands: any
  private isLoaded: boolean = false
  public get IsLoaded(): boolean {
    return this.isLoaded
  }

  constructor(videoElement: HTMLVideoElement) {
    super()

    this.hands = new Hands({
      locateFile: (file: string) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.1/${file}`
      },
    })

    this.camera = new Camera(videoElement, {
      onFrame: () => this.CameraCallback(videoElement),
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
      this.hands.onResults((r: HandtrackResult) => this.HandCallback(r, res))
    })
  }

  protected Start(): void {
    if (!this.isLoaded) throw new Error('Handtrack is not loaded')
    // Disable alert and error and camera is used elsewhere
    window.alert = function () {}
    this.camera.start().catch(console.log)
  }

  protected Stop(): void {}

  private HandCallback(result: HandtrackResult, onLoad: (h: Handtrack) => void): void {
    this.Emit('all', result)
    if (this.isLoaded) return
    this.isLoaded = true
    onLoad(this)
  }

  private CameraCallback(videoElement: HTMLVideoElement) {
    if (this.isRunning) this.hands.send({ image: videoElement })
  }
}
