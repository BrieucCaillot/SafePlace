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

type MountainJourneyStore = {}

const useMountainJourneyStore = create<MountainJourneyStore>(
  (set, get, state) => ({})
)

export default useMountainJourneyStore
