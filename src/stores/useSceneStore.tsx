import { get } from 'node:http'
import * as THREE from 'three'
import create from 'zustand'

export enum Scenes {
  Safeplace = 'Safeplace',
  About = 'About',
  MountainJourney = 'MountainJourney',
}

type SceneStore = {
  currentScene: Scenes
  setCurrentScene: (scene: Scenes) => void
  isCurrentScene: (scene: Scenes) => boolean
  showSafeplace: boolean
  setShowSafeplace: (status: boolean) => void
}

const useSceneStore = create<SceneStore>((set, get) => ({
  currentScene: Scenes.Safeplace,
  setCurrentScene: (scene) => set({ currentScene: scene }),
  isCurrentScene: (scene) => scene == get().currentScene,
  showSafeplace: true,
  setShowSafeplace: (status) => set({ showSafeplace: status }),
}))

export default useSceneStore
