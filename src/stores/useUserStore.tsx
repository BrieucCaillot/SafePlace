import { Router } from 'next/router'
import create from 'zustand'

import AnimationStatus from '@/constants/enums/AnimationStatus'

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
  cloudsTransitionStatus: AnimationStatus
  setCloudsTransitionStatus: (status: AnimationStatus) => void
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
  // @TODO Find a new name
  isJourneyFinished: false,
  setIsJourneyFinished: (status) => set({ isJourneyFinished: status }),
  isJourneyCompleted: false,
  getIsJourneyCompleted: () =>
    window.localStorage.getItem('isJourneyCompleted') == 'true' ? true : false,
  setIsJourneyCompleted: (status) => {
    window.localStorage.setItem('isJourneyCompleted', status.toString())
    set({ isJourneyCompleted: status })
  },
  // CLOUDS TRANSITION
  // @TODO (MAYBE MOVE TO ANOTHER STORE)
  cloudsTransitionStatus: AnimationStatus.Paused,
  setCloudsTransitionStatus: (status) =>
    set({ cloudsTransitionStatus: status }),
}))

export default useUserStore
