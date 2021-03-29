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
  setPOIData: (key: SafeplacePOI, value: POI) => void
  getPOIData: (key: SafeplacePOI) => POI | undefined
}

const useSafeplaceStore = create<SafeplaceStore>((set, get, state) => ({
  currentPOI: SafeplacePOI.OnBoarding,
  setCurrentPOI: (SafeplacePOI) => set({ currentPOI: SafeplacePOI }),
  POIMap: new Map(),
  setPOIData: (key, value) => set({ POIMap: get().POIMap.set(key, value) }),
  getPOIData: (key) => get().POIMap.get(key),
}))

export default useSafeplaceStore
