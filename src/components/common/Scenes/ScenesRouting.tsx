import { ReactElement, useEffect } from 'react'
import { NextRouter } from 'next/router'

import useJourneyStore from '@/stores/useJourneyStore'
import useSafeplaceStore from '@/stores/useSafeplaceStore'
import useSceneStore from '@/stores/useSceneStore'
import useUserStore from '@/stores/useUserStore'
import usePrevious from '@/hooks/usePrevious'
import SceneName from '@/constants/enums/SceneName'
import SafeplacePOI from '@/constants/enums/SafeplacePOI'
import JourneySection from '@/constants/enums/JourneySection'
import Routes from '@/constants/enums/Routes'
import AnimationStatus from '@/constants/enums/AnimationStatus'

const ScenesRouting = ({
  router: { pathname },
}: {
  router: NextRouter
}): ReactElement<any, any> => {
  const previousPathname = usePrevious(pathname)
  const cloudsTransitionStatus = useUserStore((s) => s.cloudsTransitionStatus)

  useEffect(() => {
    const {
      mountScene,
      setRenderedScene,
      unmountAllScenes,
    } = useSceneStore.getState()

    if (pathname === Routes.Index) {
      unmountAllScenes()
      setRenderedScene(null)
    }

    if (pathname === Routes.OnBoarding) {
      const { setCloudsTransitionStatus } = useUserStore.getState()
      setCloudsTransitionStatus(AnimationStatus.Start)
    }

    if (pathname === Routes.MountainColumn) {
      const { setCurrentPOI } = useSafeplaceStore.getState()
      mountScene(SceneName.Safeplace)
      setRenderedScene(SceneName.Safeplace)
      setCurrentPOI(SafeplacePOI.MountainColumn)
    }

    if (pathname === Routes.ResourcesFocus) {
      const { setCurrentPOI } = useSafeplaceStore.getState()
      mountScene(SceneName.Safeplace)
      setRenderedScene(SceneName.Safeplace)
      setCurrentPOI(SafeplacePOI.ResourceFocused)
    }

    if (pathname === Routes.Journey) {
      const { setCloudsTransitionStatus } = useUserStore.getState()
      setCloudsTransitionStatus(AnimationStatus.Start)
    }
  }, [pathname])

  useEffect(() => {
    const { unmountScenes } = useSceneStore.getState()
    if (pathname == previousPathname) return
    if (previousPathname === Routes.Journey) {
      const { setCloudsTransitionStatus } = useUserStore.getState()
      setCloudsTransitionStatus(AnimationStatus.Start)
      unmountScenes([
        SceneName.Lake,
        SceneName.Cairns,
        SceneName.JourneyIntro,
        SceneName.Waterfall,
      ])
    }
  }, [previousPathname, pathname])

  useEffect(() => {
    const {
      mountScene,
      mountScenes,
      setRenderedScene,
    } = useSceneStore.getState()

    const { setCloudsTransitionStatus } = useUserStore.getState()

    if (pathname === Routes.OnBoarding) {
      if (cloudsTransitionStatus === AnimationStatus.Completed) {
        const { setCurrentPOI } = useSafeplaceStore.getState()
        mountScene(SceneName.Safeplace)
        setRenderedScene(SceneName.Safeplace)
        setCurrentPOI(SafeplacePOI.OnBoarding)
        setCloudsTransitionStatus(AnimationStatus.Reverse)
      }
    }

    if (pathname === Routes.Journey) {
      if (cloudsTransitionStatus === AnimationStatus.Completed) {
        const { setSection } = useJourneyStore.getState()
        mountScenes([
          SceneName.JourneyIntro,
          SceneName.Cairns,
          SceneName.Lake,
          SceneName.Waterfall,
        ])
        setRenderedScene(SceneName.JourneyIntro)
        setSection(JourneySection.Intro)
        setCloudsTransitionStatus(AnimationStatus.Reverse)
      }
    }

    if (pathname === Routes.Safeplace) {
      const { setCurrentPOI } = useSafeplaceStore.getState()

      if (
        previousPathname === Routes.Journey ||
        previousPathname === Routes.Safeplace
      ) {
        if (cloudsTransitionStatus === AnimationStatus.Completed) {
          mountScene(SceneName.Safeplace)
          setRenderedScene(SceneName.Safeplace)
          setCurrentPOI(SafeplacePOI.Inside)
          setCloudsTransitionStatus(AnimationStatus.Reverse)
        }
      } else {
        mountScene(SceneName.Safeplace)
        setRenderedScene(SceneName.Safeplace)
        if (previousPathname === Routes.OnBoarding) {
          setCurrentPOI(SafeplacePOI.Outside)
        } else {
          setCurrentPOI(SafeplacePOI.Inside)
        }
      }
    }

    if (pathname === Routes.Resources) {
      const { setCurrentPOI } = useSafeplaceStore.getState()

      if (
        previousPathname === Routes.Journey ||
        previousPathname === Routes.Resources
      ) {
        if (cloudsTransitionStatus === AnimationStatus.Completed) {
          mountScene(SceneName.Safeplace)
          setRenderedScene(SceneName.Safeplace)
          setCurrentPOI(SafeplacePOI.Resources)
          setCloudsTransitionStatus(AnimationStatus.Reverse)
        }
      } else {
        mountScene(SceneName.Safeplace)
        setRenderedScene(SceneName.Safeplace)
        setCurrentPOI(SafeplacePOI.Resources)
      }
    }
  }, [pathname, previousPathname, cloudsTransitionStatus])

  return null
}

export default ScenesRouting
