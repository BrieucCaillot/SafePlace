import create from 'zustand'

type RAFCb = () => void

export type RAFStoreType = {
  pos: 'inside' | 'outside'
  execRaf: () => void
  rafCallbackArray: Array<RAFCb>
  subscribe: (cb: RAFCb) => () => void
}

const useRAFStore = create<RAFStoreType>((set, get) => ({
  pos: 'inside',
  execRaf: () => {
    get().rafCallbackArray.forEach((c) => c())
  },
  rafCallbackArray: [],
  subscribe: (cb: RAFCb) => {
    const { rafCallbackArray: cbs } = get()
    if (cbs.indexOf(cb) !== -1)
      throw new Error('This callback is already registered.')
    cbs.push(cb)
    set({ rafCallbackArray: cbs })
    return () => {
      const { rafCallbackArray: cbs } = get()
      const index = cbs.indexOf(cb)
      if (index > -1) cbs.splice(index, 1)
      set({ rafCallbackArray: cbs })
    }
  },
}))

export default useRAFStore
