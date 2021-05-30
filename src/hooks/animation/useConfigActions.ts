import { useEffect } from 'react'
import * as THREE from 'three'

type Config = {
  clampedWhenFinished: boolean
  loop: [THREE.AnimationActionLoopStyles, number]
}

const defaultConfig: Config = {
  clampedWhenFinished: true,
  loop: [THREE.LoopOnce, 1],
}

const useConfigActions = (
  actions: Record<string, THREE.AnimationAction>,
  name: string | null = null,
  config: Partial<Config> | Record<string, Partial<Config>> = {}
) => {
  useEffect(() => {
    const actionsToConfig =
      name === null ? Object.values(actions) : [actions[name]]

    actionsToConfig.forEach((action) => {
      const { name } = action.getClip()

      const { clampedWhenFinished, loop } =
        name in config
          ? {
              ...defaultConfig,
              ...(config as Record<string, Partial<Config>>)[name],
            }
          : { ...defaultConfig, ...(config as Partial<Config>) }

      action.clampWhenFinished = clampedWhenFinished
      action.setLoop(...loop)
    })
  }, [])
}

export default useConfigActions
