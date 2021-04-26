import * as THREE from 'three'
import create from 'zustand'

export enum Rules {
  Rule1 = 'Rule1',
  Rule2 = 'Rule2',
  Rule3 = 'Rule3',
  Rule4 = 'Rule4',
}

export type POIData = {
  position: THREE.Vector3
  quaternion: THREE.Quaternion
  scale: THREE.Vector3
}

type RulesStore = {
  currentRule: Rules
  setCurrentRule: (key: Rules) => void
}

const useRulesStore = create<RulesStore>((set, get, state) => ({
  currentRule: Rules.Rule1,
  setCurrentRule: (rule: Rules) => set({ currentRule: rule }),
}))

export default useRulesStore
