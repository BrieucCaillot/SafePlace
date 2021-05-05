import { Router } from 'next/router'
import create from 'zustand'

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
}

const useUserStore = create<UserStore>((set) => ({
  router: {} as Router,
  isFirstConnection: false,
  getUserFirstConnection: () =>
    window.localStorage.getItem('isFirstConnection') == null ? true : false,
  setUserFirstConnection: (status: boolean) => {
    window.localStorage.setItem('isFirstConnection', status.toString())
    set({ isFirstConnection: status })
  },
  isJourneyFinished: false,
  setIsJourneyFinished: (status) => set({ isJourneyFinished: status }),
  isJourneyCompleted: false,
  getIsJourneyCompleted: () =>
    window.localStorage.getItem('isJourneyCompleted') == 'true' ? true : false,
  setIsJourneyCompleted: (status) => {
    window.localStorage.setItem('isJourneyCompleted', status.toString())
    set({ isJourneyCompleted: status })
  },
}))

export default useUserStore
