import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { CSSTransition, TransitionStatus } from 'react-transition-group'

import useUserStore from '@/stores/useUserStore'
import useTransitionStatus from '@/hooks/animation/useTransitionStatus'
import usePrevious from '@/hooks/usePrevious'
import Routes from '@/constants/enums/Routes'

import PortalUI from '@/components/common/UI/PortalUI'
import ButtonStonecut from '@/components/common/UI/Buttons/ButtonStonecut'

const Index = ({ status }: { status: TransitionStatus }) => {
  const show = useTransitionStatus(status)

  const router = useUserStore((s) => s.router)
  const previousPathname = usePrevious(router.pathname)

  const [hide, setHide] = useState(false)
  const [showSafeplaceAnim, setShowSafeplaceAnim] = useState(false)

  const safeplaceImgClass = useMemo(
    () => (showSafeplaceAnim ? (hide ? 'topToBottom' : 'bottomToTop') : ''),
    [showSafeplaceAnim, hide]
  )

  useEffect(() => {
    if (previousPathname === Routes.About) setShowSafeplaceAnim(true)
  }, [previousPathname])

  const onAboutButtonClick = useCallback(() => {
    setShowSafeplaceAnim(true)
    setHide(true)
    setTimeout(() => router.push(Routes.About), 2000)
  }, [router])

  const onStartButtonClick = useCallback(() => {
    setShowSafeplaceAnim(false)
    setHide(true)
    setTimeout(() => router.push(Routes.OnBoarding), 1500)
  }, [router])

  return (
    <>
      <PortalUI selector='#layout-header-right'>
        <ButtonStonecut
          show={show && !hide}
          className='text-primary cursor-pointer pointer-events-none opacity-0'
          onClick={onAboutButtonClick}
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
          <img
            className='absolute top-1/2 left-1/2 transform-gpu -translate-x-1/2 -translate-y-1/2 -mt-24 max-w-xs md:max-w-full'
            src='/img/index/logo.png'
            alt='safeplace-logo'
          />
        </CSSTransition>
        <CSSTransition
          in={show && !hide}
          timeout={2000}
          classNames='elem-fade'
          mountOnEnter
          unmountOnExit
          appear
        >
          <div className='absolute bottom-16 flex justify-center w-full'>
            <button
              onClick={onStartButtonClick}
              className='relative button-stonefull text-white text-xl font-bold tracking-widest rounded px-10 py-3 focus:outline-none cursor-pointer'
            >
              Lancer l'experience
            </button>
          </div>
        </CSSTransition>
      </div>
    </>
  )
}

export default Index
