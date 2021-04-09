import create from 'zustand'
import { createRef, ExoticComponent, FC, RefObject } from 'react'
import * as THREE from 'three'
import { WithScenePortalProps } from '@/components/common/Scenes/withScenePortal'
import SafeplaceScene from '@/components/Safeplace/Canvas/SafeplaceScene'
import SafeplaceCamera from '@/components/Safeplace/Canvas/SafeplaceCamera'
import JourneyScene from '@/components/Journey/Canvas/JourneyScene'
import JourneyCamera from '@/components/Journey/Canvas/JourneyCamera'

export enum SceneName {
  Safeplace = 'Safeplace',
  Journey = 'Journey',
}

export type SceneData = {
  Component: FC<WithScenePortalProps>
  scene: THREE.Scene
  CameraComponent: ExoticComponent<{ ref: RefObject<THREE.Camera> }>
  cameraRef: RefObject<THREE.Camera | undefined>
}

type SceneStore = {
  mountedScenes: SceneName[]
  renderedScene: SceneName | null
  mountScene: (sceneName: SceneName) => void
  unmountScene: (sceneName: SceneName) => void
  unmountAllScenes: () => void
  setRenderedScene: (sceneName: SceneName | null) => void
  scenesData: Record<SceneName, SceneData>
}

const useSceneStore = create<SceneStore>((set, get) => ({
  mountedScenes: [],
  renderedScene: null,
  mountScene: (sceneName: SceneName) => {
    const { mountedScenes } = get()
    if (mountedScenes.includes(sceneName)) return
    mountedScenes.push(sceneName)
    set({ mountedScenes })
  },
  unmountScene: (sceneName: SceneName) => {
    const { mountedScenes } = get()
    const index = mountedScenes.indexOf(sceneName)
    if (index > -1) mountedScenes.splice(index, 1)
    set({ mountedScenes })
  },
  unmountAllScenes: () => {
    set({ mountedScenes: [] })
  },
  setRenderedScene: (sceneName: SceneName | null) => {
    const { mountedScenes } = get()
    if (sceneName !== null && !mountedScenes.includes(sceneName))
      throw `${sceneName} : Cannot set a scene as rendered scene if it's not mounted`
    set({ renderedScene: sceneName })
  },
  scenesData: {
    [SceneName.Safeplace]: {
      Component: SafeplaceScene,
      scene: new THREE.Scene(),
      CameraComponent: SafeplaceCamera,
      cameraRef: createRef(),
    },
    [SceneName.Journey]: {
      Component: JourneyScene,
      scene: new THREE.Scene(),
      CameraComponent: JourneyCamera,
      cameraRef: createRef(),
    },
  },
}))

export default useSceneStore
