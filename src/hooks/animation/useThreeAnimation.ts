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
    return () => mixerRef.current.removeEventListener('finished', onFinished)
  }, [onFinished])

  return actionRef
}

// const useThreeAnimation2 = ({
//   clips,
//   current,
//   ref,
//   duration,
// }: {
//   clips: THREE.AnimationClip[],
//   current: string,
//   ref: RefObject<THREE.Object3D>
//   duration
// }) => {
//   const { actions, mixer } = useAnimations(clips, ref)
//   const t = useRef(0)
//   const clock = useMemo(() => new THREE.Clock(), [])
//   useEffect(() => void actions[current] && actions[current].play(), [])
//   useFrame(() => {
//     if (!actions[current]) return
//     t.current = THREE.MathUtils.lerp(t.current, actions["CameraAction.005"].getClip().duration, 0.05)
//     mixer.setTime()
//   })
// }

export default useThreeAnimation
