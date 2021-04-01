import * as THREE from 'three'
import create from 'zustand'

// Moutain sections
export enum MountainSections {
  One = 'One',
  Two = 'Two',
  Three = 'Three',
  Four = 'Four',
  Five = 'Five',
  Six = 'Six',
  Seven = 'Seven',
}

export type SectionData = {
  position: THREE.Vector3
  quaternion: THREE.Quaternion
  scale: THREE.Vector3
}

type SafeplaceStore = {
  currentSection: MountainSections
  setCurrentPOI: (section) => void
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
