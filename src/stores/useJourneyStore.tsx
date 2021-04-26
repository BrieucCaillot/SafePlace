import * as THREE from 'three'
import create from 'zustand'
import { SceneName } from './useSceneStore'

// Moutain sections
export enum JourneySection {
  Intro = 'Intro',
  Cairns = 'Cairns',
  Lake = 'Lake',
  Bridge = 'Bridge',
  Waterfall = 'Waterfall',
  Outro = 'Outro',
}

export const JourneyScenesAssoc: Partial<Record<JourneySection, SceneName>> = {
  // [JourneySection.Intro]: SceneName.Lake,
}

type MountainJourneyStore = {
  currentSection: JourneySection
  setSection: (section: JourneySection) => void
}

const useMountainJourneyStore = create<MountainJourneyStore>(
  (set, get, state) => ({
    currentSection: JourneySection.Intro,
    setSection: (section: JourneySection) => set({ currentSection: section }),
  })
)

export default useMountainJourneyStore
