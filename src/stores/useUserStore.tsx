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
  isFirstConnection: boolean
  getUserFirstConnection: () => boolean
  setUserFirstConnection: (status: boolean) => void
  isJourneyFinished: boolean
  setIsJourneyFinished: (status: boolean) => void
  isJourneyCompleted: boolean
  getIsJourneyCompleted: () => boolean
  setIsJourneyCompleted: (status: boolean) => void

  userData: UserData
  saveUserData: () => void
  setVoiceoverStatus: (v: Partial<UserData['voiceover']>) => void
  setJourneyStatus: (b: boolean) => void
}

const useUserStore = create<UserStore>((set, get) => ({
  router: {} as Router,
  isFirstConnection: false,
  getUserFirstConnection: () =>
    window.localStorage.getItem('isFirstConnection') == null,
  setUserFirstConnection: (status: boolean) => {
    window.localStorage.setItem('isFirstConnection', status.toString())
    set({ isFirstConnection: status })
  },
  // @TODO Find a new name
  isJourneyFinished: false,
  setIsJourneyFinished: (status) => set({ isJourneyFinished: status }),
  isJourneyCompleted: false,
  getIsJourneyCompleted: () =>
    window.localStorage.getItem('isJourneyCompleted') == 'true',
  setIsJourneyCompleted: (status) => {
    window.localStorage.setItem('isJourneyCompleted', status.toString())
    set({ isJourneyCompleted: status })
  },
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
}))

export default useUserStore
