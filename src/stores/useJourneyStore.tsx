import * as THREE from 'three'
import create from 'zustand'
import useSceneStore, { SceneName } from './useSceneStore'

// Moutain sections
export enum JourneySection {
  Intro = 'Intro',
  Cairns = 'Cairns',
  Lake = 'Lake',
  Bridge = 'Bridge',
  Waterfall = 'Waterfall',
  Outro = 'Outro',
}

const JourneyScenesAssoc: Record<JourneySection, SceneName> = {
  [JourneySection.Intro]: SceneName.JourneyIntro,
  [JourneySection.Cairns]: SceneName.Cairns,
  [JourneySection.Lake]: SceneName.Lake,
  [JourneySection.Bridge]: SceneName.Waterfall,
  [JourneySection.Waterfall]: SceneName.Waterfall,
  [JourneySection.Outro]: SceneName.Waterfall,
}

type JourneyStore = {
  currentSection: JourneySection
  setSection: (section: JourneySection) => void
}

const useJourneyStore = create<JourneyStore>((set, get, state) => ({
  currentSection: JourneySection.Intro,
  setSection: (section: JourneySection) => {
    const { mountScene, setRenderedScene } = useSceneStore.getState()
    mountScene(JourneyScenesAssoc[section])
    setRenderedScene(JourneyScenesAssoc[section])
    set({ currentSection: section })
  },
}))

export default useJourneyStore
