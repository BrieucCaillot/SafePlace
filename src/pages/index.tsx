import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { CSSTransition, TransitionStatus } from 'react-transition-group'

import useUserStore from '@/stores/useUserStore'
import useTransitionStatus from '@/hooks/animation/useTransitionStatus'
import usePrevious from '@/hooks/usePrevious'
import Routes from '@/constants/enums/Routes'

import PortalUI from '@/components/common/UI/PortalUI'
import ButtonStonecut from '@/components/common/UI/Buttons/ButtonStonecut'
import useSceneStore from '@/stores/useSceneStore'
import SceneName from '@/constants/enums/SceneName'
import useBooleanPromise from '@/hooks/promise/useBooleanPromise'
import useDropPromise from '@/hooks/promise/useDropPromise'
import wait from '@/utils/promise/wait'
import useAudioStore from '@/stores/useAudioStore'
import SFX from '@/constants/SFX'

const Index = ({ status }: { status: TransitionStatus }) => {
  const show = useTransitionStatus(status)

  const audio = useAudioStore((s) => s.initAudio(SFX.BUTTON))
  const router = useUserStore((s) => s.router)
  const previousPathname = usePrevious(router.pathname)

  const [hide, setHide] = useState(false)
  const [showSafeplaceAnim, setShowSafeplaceAnim] = useState(false)

  // Promise setup for sceneData loaded
  const { isWaiting, wait: waitSafeplaceLoaded, resolve } = useBooleanPromise()
  useEffect(() => {
    if (!isWaiting) return
    if (useSceneStore.getState().scenesData[SceneName.Waterfall].isLoaded)
      resolve()
    else
      return useSceneStore.subscribe(
        (b) => b && resolve(),
        (s) => s.scenesData[SceneName.Waterfall].isLoaded
      )
  }, [isWaiting])

  const safeplaceImgClass = useMemo(
    () => (showSafeplaceAnim ? (hide ? 'topToBottom' : 'bottomToTop') : ''),
    [showSafeplaceAnim, hide]
  )

  useEffect(() => {
    if (previousPathname === Routes.About) setShowSafeplaceAnim(true)
  }, [previousPathname])

  const { wrap, drop } = useDropPromise()
  useEffect(() => void drop(), [])
  const onButtonClicked = useCallback(
    (route: Routes) => {
      setShowSafeplaceAnim(true)
      setHide(true)
      let promise = wrap(wait(2000))
      if (route === Routes.Safeplace)
        promise = wrap(promise.then(waitSafeplaceLoaded))
      promise.then(() => router.push(route))
    },
    [router]
  )

  return (
    <>
      <PortalUI selector='#layout-header-right'>
        <ButtonStonecut
          show={show && !hide}
          className='text-primary cursor-pointer pointer-events-none opacity-0'
          onClick={() => onButtonClicked(Routes.About)}
        >
          A propos
        </ButtonStonecut>
      </PortalUI>

      <div id='home' className='relative h-screen w-screen'>
        <div className={`home-safeplace h-full w-full ${safeplaceImgClass}`} />
        <CSSTransition
          in={show && !hide}
          timeout={2000}
          classNames='elem-fade'
          mountOnEnter
          unmountOnExit
          appear
        >
          <div>
            <img
              className='absolute top-1/2 left-1/2 transform-gpu -translate-x-1/2 -translate-y-1/2 -mt-28 max-w-xs md:max-w-full select-none'
              src='/img/index/logo.png'
              alt='safeplace-logo'
            />

            <div
              className='absolute bottom-16 flex justify-center w-full pointer-events-auto'
              style={{ perspective: '2500px' }}
            >
              <button
                id='button-start'
                onClick={() => onButtonClicked(Routes.OnBoarding)}
                onMouseEnter={() => !audio.playing() && audio.play()}
                className={`relative button-stonefull text-white text-xl font-bold tracking-widest rounded px-10 py-3 focus:outline-none cursor-pointer select-none ${
                  hide ? 'pointer-events-none' : ''
                }`}
              >
                Lancer l'experience
              </button>
            </div>
          </div>
        </CSSTransition>
      </div>
    </>
  )
}

export default Index
