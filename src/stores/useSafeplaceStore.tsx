import * as THREE from 'three'
import create from 'zustand'

// Safeplace points of interests
export enum SafeplacePOI {
  Bridge = 'Bridge',
  About = 'About',
  OnBoarding = 'OnBoarding',
  Inside = 'Inside',
  Waterfall = 'Waterfall',
  MountainPedestal = 'MountainPedestal',
  PlaceholderPedetral1 = 'PlaceholderPedetral1',
  PlaceholderPedetral2 = 'PlaceholderPedetral2',
  PlaceholderPedetral3 = 'PlaceholderPedetral3',
  PlaceholderPedetral4 = 'PlaceholderPedetral4',
}

const POI_AVAILABILITY: Record<SafeplacePOI, SafeplacePOI[]> = {
  [SafeplacePOI.Bridge]: [],
  [SafeplacePOI.About]: [],
  [SafeplacePOI.OnBoarding]: [SafeplacePOI.Inside],
  [SafeplacePOI.Inside]: [
    SafeplacePOI.MountainPedestal,
    SafeplacePOI.PlaceholderPedetral1,
    SafeplacePOI.PlaceholderPedetral2,
    SafeplacePOI.PlaceholderPedetral3,
    SafeplacePOI.PlaceholderPedetral4,
  ],
  [SafeplacePOI.Waterfall]: [],
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
  setCurrentPOI: (SafeplacePOI) => void
  POIMap: Map<SafeplacePOI, POIData>
  setPOIData: (key: SafeplacePOI, value: Partial<POIData>) => void
  getPOIData: (key: SafeplacePOI) => POIData | undefined
  isCurrentlyAvailable: (poi: SafeplacePOI) => boolean
}

const useSafeplaceStore = create<SafeplaceStore>((set, get, state) => ({
  currentPOI: SafeplacePOI.Bridge,
  setCurrentPOI: (SafeplacePOI) => set({ currentPOI: SafeplacePOI }),
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
}))

export default useSafeplaceStore
