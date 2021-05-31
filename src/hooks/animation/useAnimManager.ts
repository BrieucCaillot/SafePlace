import useUserStore from '@/stores/useUserStore'
import promisifyAction from '@/utils/promise/promisifyAction'
import { useCallback, useEffect, useRef } from 'react'

const useAnimManager = (
  actions: Record<string, THREE.AnimationAction>,
  mixer: THREE.AnimationMixer,
  name: string | null = null
) => {
  const currentAnim = useRef<THREE.AnimationAction>(null)

  const isPaused = useUserStore((s) => s.isPaused)

  useEffect(() => {
    if (currentAnim.current === null) return
    currentAnim.current.paused = isPaused
  }, [isPaused])

  const getAction = useCallback(
    (n: string = null) => ((name || n) === null ? actions : actions[name || n]),
    [name]
  )

  const play = useCallback(
    (n: string = null) => {
      const a = getAction(n)
      if (!('clampWhenFinished' in a)) throw new Error('A name is required')

      currentAnim.current = a as THREE.AnimationAction
      currentAnim.current.reset()
      currentAnim.current.play()
      currentAnim.current.paused = useUserStore.getState().isPaused
      return promisifyAction(mixer, currentAnim.current).then(
        () => (currentAnim.current = null)
      )
    },
    [getAction]
  )

  const stop = useCallback(() => {
    if (currentAnim.current === null) return
    currentAnim.current.paused = true
    currentAnim.current = null
  }, [getAction])

  const init = useCallback(
    (n: string = null) => {
      const a = getAction(n)
      if (!('clampWhenFinished' in a)) throw new Error('A name is required')
      ;(a as THREE.AnimationAction).reset()
      ;(a as THREE.AnimationAction).play()
      ;(a as THREE.AnimationAction).paused = true
    },
    [getAction]
  )

  return { play, stop, init }
}

export default useAnimManager
