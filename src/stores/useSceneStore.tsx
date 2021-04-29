import create from 'zustand'
import { createRef, ExoticComponent, FC, RefObject } from 'react'
import * as THREE from 'three'
import { WithScenePortalProps } from '@/components/common/Scenes/withScenePortal'
import SafeplaceScene from '@/components/Safeplace/Canvas/SafeplaceScene'
import SafeplaceCamera from '@/components/Safeplace/Canvas/SafeplaceCamera'
import IntroScene from '@/components/Journey/Canvas/Scenes/Intro/IntroScene'
import ClassicCamera from '@/components/common/Canvas/ClassicCamera'
import LakeScene from '@/components/Journey/Canvas/Scenes/Lake/LakeScene'
import CairnsScene from '@/components/Journey/Canvas/Scenes/Cairns/CairnsScene'
import WaterfallScene from '@/components/Journey/Canvas/Scenes/Waterfall/WaterfallScene'
import WaterfallCamera from '@/components/Journey/Canvas/Scenes/Waterfall/WaterfallCamera'
import SceneName from 'constants/enums/SceneName'

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
  mountScenes: (sceneNames: SceneName[]) => void
  unmountScene: (sceneName: SceneName) => void
  unmountScenes: (sceneNames: SceneName[]) => void
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
  mountScenes: (sceneNames: SceneName[]) => {
    const { mountedScenes } = get()
    for (const sceneName of sceneNames) {
      if (mountedScenes.includes(sceneName)) return
      mountedScenes.push(sceneName)
    }
    set({ mountedScenes })
  },
  unmountScene: (sceneName: SceneName) => {
    const { mountedScenes } = get()
    const index = mountedScenes.indexOf(sceneName)
    if (index > -1) mountedScenes.splice(index, 1)
    set({ mountedScenes })
  },
  unmountScenes: (sceneNames: SceneName[]) => {
    const { mountedScenes } = get()
    for (const name of sceneNames) {
      const index = mountedScenes.indexOf(name)
      if (index > -1) mountedScenes.splice(index, 1)
    }
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
    [SceneName.Lake]: {
      Component: LakeScene,
      scene: new THREE.Scene(),
      CameraComponent: ClassicCamera,
      cameraRef: createRef(),
    },
    [SceneName.JourneyIntro]: {
      Component: IntroScene,
      scene: new THREE.Scene(),
      CameraComponent: ClassicCamera,
      cameraRef: createRef(),
    },
    [SceneName.Cairns]: {
      Component: CairnsScene,
      scene: new THREE.Scene(),
      CameraComponent: ClassicCamera,
      cameraRef: createRef(),
    },
    [SceneName.Waterfall]: {
      Component: WaterfallScene,
      scene: new THREE.Scene(),
      CameraComponent: WaterfallCamera,
      // CameraComponent: ClassicCamera,
      cameraRef: createRef(),
    },
  },
}))

export default useSceneStore
