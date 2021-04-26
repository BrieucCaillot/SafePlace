import create from 'zustand'

type UserStore = {
  isFirstConnection: 'true' | 'false'
  getUserFirstConnection: () => string
  setUserFirstConnection: (status: string) => void
}

const useUserStore = create<UserStore>((set) => ({
  isFirstConnection: 'false',
  getUserFirstConnection: () =>
    window.localStorage.getItem('isFirstConnection'),
  setUserFirstConnection: (status: UserStore['isFirstConnection']) => {
    window.localStorage.setItem('isFirstConnection', status)
    set({ isFirstConnection: status })
  },
}))

export default useUserStore
