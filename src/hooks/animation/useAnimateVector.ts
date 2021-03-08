import * as THREE from 'three'
import gsap from 'gsap'
import { MutableRefObject, useEffect } from 'react'

export type Target =
  | MutableRefObject<THREE.Vector3 | undefined>
  | {
      ref: MutableRefObject<THREE.Object3D | undefined>
      target: 'position' | 'scale' | 'rotation'
    }
  | {
      ref: MutableRefObject<THREE.IUniform | undefined>
      target: 'value'
    }

const useAnimateVector = (
  target: Target,
  value: [number, number, number],
  gsapParams: gsap.TweenVars
): void => {
  useEffect(() => {
    const ref = 'ref' in target ? target.ref : target
    if (!ref.current) return

    const vecTarget = 'ref' in target ? ref.current[target.target] : ref.current
    gsap.to(vecTarget, {
      x: value[0],
      y: value[1],
      z: value[2],
      ...gsapParams,
    })
  }, [value[0], value[1], value[2]])
}

export default useAnimateVector
