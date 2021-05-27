import { useMemo, useState } from 'react'
import gsap from 'gsap'
import useSceneStore, { SceneData } from '@/stores/useSceneStore'
import useWatchableRef from '@/hooks/useWatchableRef'
import useNonInitialEffect from '@/hooks/useNonInitialEffect'

const useSceneTransition = () => {
  const renderedSceneData = useSceneStore((s) =>
    s.renderedScene ? s.scenesData[s.renderedScene] : null
  )

  const nextSceneData = useSceneStore((s) =>
    s.nextScene ? s.scenesData[s.nextScene] : null
  )

  const endTransition = useSceneStore((s) => s.endTransition)
  const [waitForSceneLoad, setWaitForSceneLoad] = useState(false)
  const [shouldShowNextScene, setShouldShowNextScene] = useState(false)

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
    if (nextSceneData === null) return
    outProgress.current = 0
    inProgress.current = 0
    const anim = gsap.to(outProgress, {
      current: 1,
      ...transitionAnimParams,
      onComplete: () => {
        setWaitForSceneLoad(true)
      },
    })
    return () => anim.kill()
  }, [nextSceneData])

  useNonInitialEffect(() => {
    if (!waitForSceneLoad || !nextSceneData?.isLoaded) return
    setWaitForSceneLoad(false)
    setShouldShowNextScene(true)
  }, [waitForSceneLoad, nextSceneData])

  // In anim
  const inProgress = useWatchableRef<number>(0)
  useNonInitialEffect(() => {
    if (waitForSceneLoad) return
    const anim = gsap.to(inProgress, {
      current: 1,
      delay: 0.5,
      ...transitionAnimParams,
      onComplete: () => {
        inProgress.current = 0
        outProgress.current = 0
        setShouldShowNextScene(false)
        endTransition()
      },
    })
    return () => {
      anim.kill()
    }
  }, [waitForSceneLoad])

  return {
    renderedSceneData: shouldShowNextScene ? nextSceneData : renderedSceneData,
    inProgress,
    outProgress,
  }
}

export default useSceneTransition
