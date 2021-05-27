import { useAnimations } from '@react-three/drei'
import { RefObject, useEffect, useMemo, useRef } from 'react'
import { useFrame } from 'react-three-fiber'
import * as THREE from 'three'

const useThreeAnimation = ({
  clip,
  ref,
  update = true,
  onFinished = null,
}: {
  clip: THREE.AnimationClip
  ref: RefObject<THREE.Object3D>
  update?: boolean
  onFinished?: (e: THREE.Event) => void
}) => {
  const mixerRef = useRef<THREE.AnimationMixer>(null)
  const actionRef = useRef<THREE.AnimationAction>(null)
  const clockRef = useRef<THREE.Clock>(new THREE.Clock(true))

  useEffect(() => {
    if (ref.current == null) return
    mixerRef.current = new THREE.AnimationMixer(ref.current)
  }, [])

  useFrame(() => {
    if (mixerRef.current == null || !update) return
    mixerRef.current.update(clockRef.current.getDelta())
  })

  useEffect(() => {
    if (actionRef.current !== null) actionRef.current.stop()
    if (clip == null) return
    const action = mixerRef.current.clipAction(clip)
    action.setLoop(THREE.LoopOnce, 1)
    action.clampWhenFinished = true
    action.play()
    actionRef.current = action
  }, [clip])

  useEffect(() => {
    if (mixerRef.current == null || onFinished == null) return
    mixerRef.current.addEventListener('finished', onFinished)
    mixerRef.current.addEventListener('finished', console.log)
    return () => mixerRef.current.removeEventListener('finished', onFinished)
  }, [onFinished])

  return actionRef
}

export default useThreeAnimation
