import * as THREE from 'three'
import create from 'zustand'

// Moutain sections
export enum MountainSections {
  One = 'One',
  Two = 'Two',
  Three = 'Three',
  Four = 'Four',
  Five = 'Five',
}

export type SectionData = {
  position: THREE.Vector3
  quaternion: THREE.Quaternion
  scale: THREE.Vector3
}

type MountainJourneyStore = {
  currentSection: MountainSections
  setCurrentSection: (section: MountainSections) => void
  sectionsMap: Map<MountainSections, SectionData>
  setSectionData: (key: MountainSections, value: Partial<SectionData>) => void
  getSectionData: (key: MountainSections) => SectionData | undefined
}

const useMountainJourneyStore = create<MountainJourneyStore>(
  (set, get, state) => ({
    currentSection: MountainSections.One,
    setCurrentSection: (mountainSection) =>
      set({ currentSection: mountainSection }),
    sectionsMap: new Map(),
    setSectionData: (
      key,
      {
        position = new THREE.Vector3(),
        quaternion = new THREE.Quaternion(),
        scale = new THREE.Vector3(1, 1, 1),
      }
    ) => {
      set({
        sectionsMap: get().sectionsMap.set(key, {
          position,
          quaternion,
          scale,
        }),
      })
    },
    getSectionData: (key) => get().sectionsMap.get(key),
  })
)

export default useMountainJourneyStore
