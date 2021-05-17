import { useMemo, useState } from 'react'
import { gsap } from 'gsap'
import useSceneStore, { SceneData } from '@/stores/useSceneStore'
import useWatchableRef from '@/hooks/useWatchableRef'
import useNonInitialEffect from '@/hooks/useNonInitialEffect'

const useSceneTransition = () => {
  const storeRenderedSceneData = useSceneStore((s) =>
    s.renderedScene ? s.scenesData[s.renderedScene] : null
  )

  const [renderedSceneData, setRenderedSceneData] = useState<SceneData>(
    storeRenderedSceneData
  )

  const setInTransition = useSceneStore((s) => s.setInTransition)
  const [waitForSceneLoad, setWaitForSceneLoad] = useState(false)

  const transitionAnimParams = useMemo<gsap.TweenVars>(
    () => ({
      ease: 'power3.out',
      duration: 2.5,
    }),
    []
  )

  // Out anim
  const outProgress = useWatchableRef<number>(0)
  useNonInitialEffect(() => {
    setInTransition(true)
    const anim = gsap.to(outProgress, {
      current: 1,
      ...transitionAnimParams,
      onComplete: () => {
        setWaitForSceneLoad(true)
      },
    })
    return () => anim.kill()
  }, [storeRenderedSceneData])

  useNonInitialEffect(() => {
    if (!waitForSceneLoad || !storeRenderedSceneData?.isLoaded) return
    setRenderedSceneData(storeRenderedSceneData)
    setWaitForSceneLoad(false)
  }, [waitForSceneLoad, storeRenderedSceneData])

  // In anim
  const inProgress = useWatchableRef<number>(0)
  useNonInitialEffect(() => {
    const anim = gsap.to(inProgress, {
      current: 1,
      ...transitionAnimParams,
      onComplete: () => {
        inProgress.current = 0
        outProgress.current = 0
        setInTransition(false)
      },
    })
    return () => anim.kill()
  }, [renderedSceneData])

  return { renderedSceneData, inProgress, outProgress }
}

export default useSceneTransition
