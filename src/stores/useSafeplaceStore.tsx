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

type POI = {
  position: THREE.Vector3
}

type SafeplaceStore = {
  currentPOI: SafeplacePOI
  setCurrentPOI: (SafeplacePOI) => void
  POIMap: Map<SafeplacePOI, POI>
  setPOI: (key: SafeplacePOI, value: POI) => void
  getPOI: (key: SafeplacePOI) => POI | undefined
}

const useSafeplaceStore = create<SafeplaceStore>((set, get, state) => ({
  currentPOI: SafeplacePOI.OnBoarding,
  setCurrentPOI: (SafeplacePOI) => set({ currentPOI: SafeplacePOI }),
  POIMap: new Map(),
  setPOI: (key, value) => set({ POIMap: get().POIMap.set(key, value) }),
  getPOI: (key) => get().POIMap.get(key),
}))

window.useSafeplaceStore = useSafeplaceStore

export default useSafeplaceStore
