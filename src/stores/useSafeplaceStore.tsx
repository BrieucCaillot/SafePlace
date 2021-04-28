import * as THREE from 'three'
import create from 'zustand'

// Safeplace points of interests
export enum SafeplacePOI {
  OnBoarding = 'OnBoarding',
  Outside = 'Outside',
  Resources = 'Resources',
  ResourceFocused = 'ResourceFocused',
  Inside = 'Inside',
  MountainPedestal = 'MountainPedestal',
  PlaceholderPedetral1 = 'PlaceholderPedetral1',
  PlaceholderPedetral2 = 'PlaceholderPedetral2',
  PlaceholderPedetral3 = 'PlaceholderPedetral3',
  PlaceholderPedetral4 = 'PlaceholderPedetral4',
}

const POI_AVAILABILITY: Record<SafeplacePOI, SafeplacePOI[]> = {
  [SafeplacePOI.OnBoarding]: [],
  [SafeplacePOI.Outside]: [SafeplacePOI.Inside],
  [SafeplacePOI.Resources]: [SafeplacePOI.Inside],
  [SafeplacePOI.ResourceFocused]: [SafeplacePOI.Resources],
  [SafeplacePOI.Inside]: [
    SafeplacePOI.Resources,
    SafeplacePOI.MountainPedestal,
    SafeplacePOI.PlaceholderPedetral1,
    SafeplacePOI.PlaceholderPedetral2,
    SafeplacePOI.PlaceholderPedetral3,
    SafeplacePOI.PlaceholderPedetral4,
  ],
  [SafeplacePOI.MountainPedestal]: [],
  [SafeplacePOI.PlaceholderPedetral1]: [],
  [SafeplacePOI.PlaceholderPedetral2]: [],
  [SafeplacePOI.PlaceholderPedetral3]: [],
  [SafeplacePOI.PlaceholderPedetral4]: [],
}

export type POIData = {
  position: THREE.Vector3
  quaternion: THREE.Quaternion
  scale: THREE.Vector3
}

type SafeplaceStore = {
  currentPOI: SafeplacePOI
  setCurrentPOI: (key: SafeplacePOI) => void
  POIMap: Map<SafeplacePOI, POIData>
  setPOIData: (key: SafeplacePOI, value: Partial<POIData>) => void
  getPOIData: (key: SafeplacePOI) => POIData | undefined
  isCurrentlyAvailable: (poi: SafeplacePOI) => boolean
  isCameraTravelling: boolean
  setIsCameraTravelling: (status: boolean) => void
}

const useSafeplaceStore = create<SafeplaceStore>((set, get, state) => ({
  currentPOI: SafeplacePOI.Outside,
  setCurrentPOI: (SafeplacePOI) =>
    set({ currentPOI: SafeplacePOI, isCameraTravelling: true }),
  POIMap: new Map(),
  setPOIData: (
    key,
    {
      position = new THREE.Vector3(),
      quaternion = new THREE.Quaternion(),
      scale = new THREE.Vector3(1, 1, 1),
    }
  ) => {
    set({ POIMap: get().POIMap.set(key, { position, quaternion, scale }) })
  },
  getPOIData: (key) => get().POIMap.get(key),
  isCurrentlyAvailable: (poi: SafeplacePOI) =>
    POI_AVAILABILITY[get().currentPOI].includes(poi),
  isCameraTravelling: false,
  setIsCameraTravelling: (status) => set({ isCameraTravelling: status }),
}))

export default useSafeplaceStore
