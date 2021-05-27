import promisifyAction from '@/utils/promise/promisifyAction'
import { useCallback, useEffect } from 'react'
import * as THREE from 'three'

const useConfigAction = (
  actions: Record<string, THREE.AnimationAction>,
  name: string,
  {
    clampedWhenFinished = true,
    loop = [THREE.LoopOnce, 1],
  }: {
    clampedWhenFinished?: boolean
    loop?: [THREE.AnimationActionLoopStyles, number]
  } = {}
) => {
  useEffect(() => {
    const action = actions[name]
    action.clampWhenFinished = clampedWhenFinished
    action.setLoop(...loop)
    action.play()

    action.paused = true
    return () => void (action.paused = true)
  }, [])
}

export default useConfigAction
