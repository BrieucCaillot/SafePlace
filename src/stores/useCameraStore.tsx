import create from 'zustand'

type CameraStore = {
  cameraIsTravelling: boolean
  setCameraIsTravelling: (status: boolean) => void
}

const useCameraStore = create<CameraStore>((set, get) => ({
  cameraIsTravelling: false,
  setCameraIsTravelling: (status) => set({ cameraIsTravelling: status }),
}))

export default useCameraStore
