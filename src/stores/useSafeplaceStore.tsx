import * as THREE from 'three'
import create from 'zustand'

// Safeplace points of interests
export enum SafeplacePOI {
  OnBoarding = 'OnBoarding',
  Inside = 'Inside',
  Pedestal1 = 'Pedestal1',
  Pedestal2 = 'Pedestal2',
  Pedestal3 = 'Pedestal3',
  Pedestal4 = 'Pedestal4',
  Pedestal5 = 'Pedestal5',
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
}

const useSafeplaceStore = create<SafeplaceStore>((set, get, state) => ({
  currentPOI: SafeplacePOI.OnBoarding,
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
}))

export default useSafeplaceStore
