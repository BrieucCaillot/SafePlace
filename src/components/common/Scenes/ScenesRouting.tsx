import { ReactElement, ReactNode, useEffect } from 'react'
import { NextRouter, withRouter } from 'next/router'

import useJourneyStore from '@/stores/useJourneyStore'
import useSafeplaceStore from '@/stores/useSafeplaceStore'
import useSceneStore from '@/stores/useSceneStore'
import useUserStore from '@/stores/useUserStore'
import usePrevious from '@/hooks/usePrevious'
import SceneName from '@/constants/enums/SceneName'
import SafeplacePOI from '@/constants/enums/SafeplacePOI'
import JourneySection from '@/constants/enums/JourneySection'

const ScenesRouting = ({
  router: { pathname },
}: {
  router: NextRouter
}): ReactElement<any, any> => {
  const previousPathname = usePrevious(pathname)

  const isFirstConnection = useUserStore((state) => state.isFirstConnection)

  useEffect(() => {
    const {
      mountScene,
      mountScenes,
      setRenderedScene,
      unmountAllScenes,
      mountedScenes,
    } = useSceneStore.getState()

    if (pathname === '/') {
      unmountAllScenes()
      setRenderedScene(null)
    }

    if (pathname === '/onboarding') {
      const { setCurrentPOI } = useSafeplaceStore.getState()
      mountScene(SceneName.Safeplace)
      setRenderedScene(SceneName.Safeplace)
      setCurrentPOI(SafeplacePOI.OnBoarding)
    }

    if (pathname === '/safeplace') {
      const { setCurrentPOI } = useSafeplaceStore.getState()
      mountScene(SceneName.Safeplace)
      setRenderedScene(SceneName.Safeplace)
    }

    if (pathname === '/resources') {
      const { setCurrentPOI } = useSafeplaceStore.getState()
      mountScene(SceneName.Safeplace)
      setRenderedScene(SceneName.Safeplace)
      setCurrentPOI(SafeplacePOI.Resources)
    }

    if (pathname === '/resource/journey') {
      const { setCurrentPOI } = useSafeplaceStore.getState()
      mountScene(SceneName.Safeplace)
      setRenderedScene(SceneName.Safeplace)
      setCurrentPOI(SafeplacePOI.ResourceFocused)
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
    const { setCurrentPOI } = useSafeplaceStore.getState()
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
