import create from 'zustand'
import useSceneStore from './useSceneStore'
import JOURNEY_SECTION_SCENES from '@/constants/JOURNEY_SECTION_SCENES'
import JourneySection from '@/constants/enums/JourneySection'

// Moutain sections

type JourneyStore = {
  currentSection: JourneySection
  setSection: (section: JourneySection) => void
  endButtonCallback: () => void | null
  setEndButtonCallback: (newVal: () => void | null) => void
  showShelterButton: boolean
  setShowShelterButton: (newVal: boolean) => void
}

const useJourneyStore = create<JourneyStore>((set, get, state) => ({
  currentSection: JourneySection.Intro,
  setSection: (section: JourneySection) => {
    const { mountScene, setRenderedScene } = useSceneStore.getState()
    mountScene(JOURNEY_SECTION_SCENES[section])
    setRenderedScene(JOURNEY_SECTION_SCENES[section])
    set({ currentSection: section })
  },
  endButtonCallback: null,
  setEndButtonCallback: (newVal: () => void | null) =>
    set({ endButtonCallback: newVal }),
  showShelterButton: true,
  setShowShelterButton: (newVal: boolean) => set({ showShelterButton: newVal }),
}))

export default useJourneyStore
