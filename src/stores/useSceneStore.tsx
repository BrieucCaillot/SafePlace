import create from 'zustand'
import {
  createRef,
  Ref,
  FC,
  RefObject,
  PropsWithoutRef,
  RefAttributes,
  ForwardRefExoticComponent,
  MutableRefObject,
} from 'react'
import * as THREE from 'three'
import { WithScenePortalProps } from '@/components/common/Scenes/withScenePortal'
import SafeplaceScene from '@/components/Safeplace/Canvas/SafeplaceScene'
import SafeplaceCamera from '@/components/Safeplace/Canvas/SafeplaceCamera'
import IntroScene from '@/components/Journey/Canvas/Scenes/Intro/IntroScene'
import ClassicCamera from '@/components/common/Canvas/ClassicCamera'
import LakeScene from '@/components/Journey/Canvas/Scenes/Lake/LakeScene'
import CairnsScene from '@/components/Journey/Canvas/Scenes/Cairns/CairnsScene'
import WaterfallScene from '@/components/Journey/Canvas/Scenes/Waterfall/WaterfallScene'
import SceneName from '@/constants/enums/SceneName'
import sceneBuilder from '@/utils/sceneBuilder'

export type SceneData = {
  Component: ForwardRefExoticComponent<
    PropsWithoutRef<WithScenePortalProps> & RefAttributes<THREE.Camera>
  >
  scene: THREE.Scene
  cameraRef: MutableRefObject<THREE.Camera | undefined>
  isLoaded: boolean
}

type SceneStore = {
  mountedScenes: SceneName[]
  renderedScene: SceneName | null
  nextScene: SceneName | null
  inTransition: boolean
  scenesData: Record<SceneName, SceneData>
  setSceneLoaded: (sceneName: SceneName, boolean: boolean) => void
  mountScene: (sceneName: SceneName) => void
  mountScenes: (sceneNames: SceneName[]) => void
  unmountScene: (sceneName: SceneName) => void
  unmountScenes: (sceneNames: SceneName[]) => void
  unmountAllScenes: () => void
  setRenderedScene: (sceneName: SceneName | null, transition?: boolean) => void
  endTransition: () => void
}

const useSceneStore = create<SceneStore>((set, get) => ({
  scenesData: {
    [SceneName.Safeplace]: {
      Component: SafeplaceScene,
      scene: sceneBuilder({
        fog: new THREE.FogExp2('#e9a8be', 0.015),
      }),
      isLoaded: false,
      cameraRef: createRef(),
    },
    [SceneName.JourneyIntro]: {
      Component: IntroScene,
      scene: sceneBuilder(),
      isLoaded: false,
      cameraRef: createRef(),
    },
    [SceneName.Cairns]: {
      Component: CairnsScene,
      scene: sceneBuilder(),
      isLoaded: false,
      cameraRef: createRef(),
    },
    [SceneName.Lake]: {
      Component: LakeScene,
      scene: sceneBuilder(),
      isLoaded: false,
      cameraRef: createRef(),
    },
    [SceneName.Waterfall]: {
      Component: WaterfallScene,
      scene: sceneBuilder(),
      isLoaded: false,
      cameraRef: createRef(),
    },
  },
  mountedScenes: [],
  renderedScene: null,
  nextScene: null,
  inTransition: false,
  setSceneLoaded: (sceneName: SceneName, boolean: boolean) => {
    const { scenesData } = get()
    scenesData[sceneName].isLoaded = boolean
    set({ scenesData })
  },
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
  setRenderedScene: (
    sceneName: SceneName | null,
    transition: boolean = true
  ) => {
    const { mountedScenes, renderedScene } = get()
    if (sceneName !== null && !mountedScenes.includes(sceneName))
      throw `${sceneName} : Cannot set a scene as rendered scene if it's not mounted`
    if (transition && sceneName !== renderedScene)
      set({ nextScene: sceneName, inTransition: transition })
    else set({ renderedScene: sceneName })
  },
  endTransition: () =>
    set({
      inTransition: false,
      nextScene: null,
      renderedScene: get().nextScene,
    }),
}))

export default useSceneStore
