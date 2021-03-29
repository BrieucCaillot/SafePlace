import * as THREE from 'three'
import gsap from 'gsap'
import { MutableRefObject, useEffect } from 'react'

export type Target =
  | MutableRefObject<THREE.Vector3 | undefined>
  | THREE.IUniform
  | {
      ref: MutableRefObject<THREE.Object3D | undefined>
      target: 'position' | 'scale' | 'rotation'
    }

const getVectorFromTarget = (
  target: Target
): THREE.Vector3 | THREE.Euler | undefined => {
  if ('current' in target) return target.current
  if ('value' in target) return target.value
  if ('ref' in target) return target.ref.current?.[target.target]
}

const useAnimateVector = (
  target: Target,
  value: THREE.Vector3Tuple,
  gsapParams: gsap.TweenVars
): void => {
  useEffect(() => {
    getVectorFromTarget(target)?.fromArray(value)
  }, [])

  useEffect(() => {
    const vecTarget = getVectorFromTarget(target)
    if (typeof vecTarget === 'undefined') return
    gsap.to(vecTarget, {
      x: value[0],
      y: value[1],
      z: value[2],
      ...gsapParams,
    })
  }, [value[0], value[1], value[2]])
}

export default useAnimateVector
