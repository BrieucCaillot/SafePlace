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
  progress: { value: number }
  progressCbs: ((n: number) => void)[]
  onProgress: (cb: (n: number) => void) => () => void
  setProgress: (n: number | ((n: number) => number)) => void
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
  progress: { value: 0 },
  progressCbs: [],
  onProgress: (cb: (n: number) => void) => {
    const { progressCbs } = get()
    progressCbs.push(cb)
    return () => {
      const index = progressCbs.indexOf(cb)
      if (index > -1) progressCbs.splice(index, 1)
    }
  },
  setProgress: (n: number | ((n: number) => number)) => {
    const { progress, progressCbs } = get()
    progress.value = typeof n === 'number' ? n : n(progress.value)
    for (const cb of progressCbs) cb(progress.value)
  },
}))

export default useJourneyStore
