import { Router } from 'next/router'
import create from 'zustand'

// const introVoices = {
//   intro: 'Arrived',
//   inside: 'Inside',
//   mountainColumn: 'MountainColumn',
//   backFromJourney: 'BackFromJourney',
// }

type UserData = {
  voiceover: {
    arrived: boolean
    inside: boolean
    mountainColumn: boolean
    backFromJourney: boolean
  }
  journey: boolean
}

type UserStore = {
  router: Router
  userData: UserData
  saveUserData: () => void
  setVoiceoverStatus: (v: Partial<UserData['voiceover']>) => void
  setJourneyStatus: (b: boolean) => void
  isPaused: boolean
  setPause: (b: boolean) => void
}

const useUserStore = create<UserStore>((set, get) => ({
  router: {} as Router,
  userData: JSON.parse(
    typeof window !== 'undefined'
      ? window.localStorage.getItem('userData')
      : null
  ) || {
    voiceover: {
      intro: false,
      inside: false,
      mountainColumn: false,
      backFromJourney: false,
    },
    journey: false,
  },
  saveUserData: () =>
    typeof window !== 'undefined' &&
    window.localStorage.setItem('userData', JSON.stringify(get().userData)),
  setVoiceoverStatus: (v: Partial<UserData['voiceover']>) => {
    const { userData, saveUserData } = get()
    userData.voiceover = { ...userData.voiceover, ...v }
    set({ userData })
    saveUserData()
  },
  setJourneyStatus: (b: boolean) => {
    const { userData, saveUserData } = get()
    userData.journey = b
    set({ userData })
    saveUserData()
  },
  isPaused: false,
  setPause: (b) => set({ isPaused: b }),
}))

export default useUserStore
