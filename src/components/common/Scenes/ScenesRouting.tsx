import usePrevious from '@/hooks/usePrevious'
import useJourneyStore, { JourneySection } from '@/stores/useJourneyStore'
import useSafeplaceStore, { SafeplacePOI } from '@/stores/useSafeplaceStore'
import useSceneStore, { SceneName } from '@/stores/useSceneStore'
import { NextRouter, withRouter } from 'next/router'
import { ReactElement, ReactNode, useEffect } from 'react'

const ScenesRouting = ({
  router: { pathname },
}: {
  router: NextRouter
}): ReactElement<any, any> => {
  const previousPathname = usePrevious(pathname)

  useEffect(() => {
    const {
      mountScene,
      mountScenes,
      setRenderedScene,
      unmountAllScenes,
    } = useSceneStore.getState()

    if (pathname === '/') {
      unmountAllScenes()
      setRenderedScene(null)
    }

    if (pathname === '/safeplace') {
      const { setCurrentPOI } = useSafeplaceStore.getState()
      mountScene(SceneName.Safeplace)
      setRenderedScene(SceneName.Safeplace)
      setCurrentPOI(SafeplacePOI.OnBoarding)
    }

    if (pathname === '/journey') {
      const { setSection } = useJourneyStore.getState()
      mountScenes([
        SceneName.Lake,
        SceneName.Cairns,
        SceneName.JourneyIntro,
        SceneName.Waterfall,
      ])
      setRenderedScene(SceneName.Lake)
      setSection(JourneySection.Intro)
    }
  }, [pathname])

  useEffect(() => {
    const { unmountScenes } = useSceneStore.getState()
    if (pathname == previousPathname) return
    if (previousPathname === '/journey') {
      unmountScenes([
        SceneName.Lake,
        SceneName.Cairns,
        SceneName.JourneyIntro,
        SceneName.Waterfall,
      ])
    }
  }, [previousPathname, pathname])

  return null
}

export default ScenesRouting
