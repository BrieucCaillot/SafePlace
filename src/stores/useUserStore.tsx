import { Router } from 'next/router'
import create from 'zustand'

type UserStore = {
  router: Router
  isFirstConnection: 'true' | 'false'
  getUserFirstConnection: () => string
  setUserFirstConnection: (status: string) => void
}

const useUserStore = create<UserStore>((set) => ({
  router: {} as Router,
  isFirstConnection: 'false',
  getUserFirstConnection: () =>
    window.localStorage.getItem('isFirstConnection'),
  setUserFirstConnection: (status: UserStore['isFirstConnection']) => {
    window.localStorage.setItem('isFirstConnection', status)
    set({ isFirstConnection: status })
  },
}))

export default useUserStore
