import { useEffect } from 'react'

const useInitAnimation = (
  actions: Record<string, THREE.AnimationAction>,
  name: string | null = null,
  updateBool: boolean = true
) => {
  useEffect(() => {
    const action = name === null ? Object.values(actions)[0] : actions[name]

    if (action.enabled) action.reset()
    action.play()
    action.paused = true

    return () => void (action.paused = true)
  }, [name, updateBool])
}

export default useInitAnimation
