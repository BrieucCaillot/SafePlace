import create from 'zustand'
import { Hands } from '@mediapipe/hands/hands'
import { Camera } from '@mediapipe/camera_utils/camera_utils'
import * as THREE from 'three'

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

type HandtrackCallback = (result: HandtrackResult) => void

export type HandtrackResult =
  | DoubleHandtrackResult
  | SingleHandtrackResult
  | EmptyHandtrackResult

type HandtrackStore = {
  handtrackCallbacks: HandtrackCallback[]
  hands: { [name: string]: any } | null
  camera: { [name: string]: any } | null
  isLoaded: boolean
  cursor: THREE.Vector2
  cursorTarget: THREE.Vector2
  initHands: () => void
  initCamera: (videoElement: HTMLVideoElement) => void
  load: () => Promise<void>
  subscribe: (cb: HandtrackCallback) => () => void
  start: () => void
  updateCursor: (x: number, y: number) => void
  updateCursorTarget: (x: number, y: number) => void
}

const useHandtrackStore = create<HandtrackStore>((set, get) => ({
  handtrackCallbacks: [],
  hands: null,
  initHands: () => {
    set({
      hands: new Hands({
        locateFile: (file: string) => {
          return `models/${file}`
        },
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.7,
      }),
    })
  },
  camera: null,
  initCamera: (videoElement) => {
    set({
      camera: new Camera(videoElement, {
        onFrame: () => get().hands?.send({ image: videoElement }),
        width: 1280,
        height: 720,
      }),
    })
  },
  isLoaded: false,
  load: () =>
    new Promise<void>((res) => {
      const { hands, isLoaded } = get()
      const image = new Image()
      image.src = './empty.png'
      image.addEventListener('load', () => {
        hands?.send({ image })
      })
      hands?.onResults((r: HandtrackResult) => {
        get().handtrackCallbacks.forEach((cb) => cb(r))
        if (isLoaded) return
        set({ isLoaded: true })
        res()
      })
    }),
  subscribe: (cb: HandtrackCallback) => {
    const { handtrackCallbacks } = get()
    handtrackCallbacks.push(cb)
    set({ handtrackCallbacks })
    return () => {
      const { handtrackCallbacks } = get()
      const i = handtrackCallbacks.indexOf(cb)
      if (i > -1) handtrackCallbacks.splice(i, 1)
      set({ handtrackCallbacks })
    }
  },
  start: () => {
    const { camera } = get()
    if (camera === null)
      throw new Error('Cannot start camera before it is initiated')
    camera.start()
  },
  cursor: new THREE.Vector2(),
  updateCursor: (x, y) => {
    get().cursor.set(x, y)
  },
  cursorTarget: new THREE.Vector2(),
  updateCursorTarget: (x, y) => {
    get().cursorTarget.set(x, y)
  },
}))

export default useHandtrackStore