import * as THREE from 'three'
import create from 'zustand'
import gsap from 'gsap'

type SafeplaceStore = {
  isCameraMoving: boolean
  isInside: boolean
  isOutside: boolean
  moveInside: (target: THREE.Vector3) => void
  moveOutside: (target: THREE.Vector3, vars: Object) => void
}

const useSafeplaceStore = create<SafeplaceStore>((set, get) => ({
  isCameraMoving: false,
  isInside: false,
  isOutside: true,
  moveInside: (camera) => {
    if (get().isInside) return

    gsap.to(camera, {
      x: 0,
      y: 4,
      z: 0,
      onStart: () =>
        set(() => ({
          isInside: false,
        })),
      onComplete: () =>
        set(() => ({
          isInside: true,
        })),
    })

    set(() => ({
      isInside: true,
    }))
  },
  moveOutside: (camera, vars) => {
    if (get().isOutside) return

    gsap.to(camera, {
      ...vars,
      onStart: () =>
        set(() => ({
          isInside: false,
        })),
      onComplete: () =>
        set(() => ({
          isOutside: true,
        })),
    })

    set(() => ({
      isInside: true,
    }))
  },
}))

export default useSafeplaceStore

// moveInside: () => {
//   if (get().isInside) return

// gsap.to(target, {
//   ...vars,
//   onStart: () =>
//     set(() => ({
//       isInside: true,
//     })),
//   onComplete: () =>
//     set(() => ({
//       isInside: false,
//     })),
// })

//   set(() => ({
//     isInside: true,
//   }))
// },
// moveOutside: () => {
//   if (get().isOutside) return
//   set(() => ({
//     isOutside: true,
//   }))
// },
// toggleIsMoving: () =>
//   set((state) => ({ isCameraMoving: !state.isCameraMoving })),
