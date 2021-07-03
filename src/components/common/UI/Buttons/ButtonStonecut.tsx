import React, { MouseEventHandler, ReactNode, useState } from 'react'
import { CSSTransition } from 'react-transition-group'
import Link from 'next/link'

import SVGStonecut from '@/components/common/UI/SVG/SVGStonecut'
import Routes from '@/constants/enums/Routes'
import useAudioStore from '@/stores/useAudioStore'
import SFX from '@/constants/SFX'

const ButtonStonecut = ({
  show,
  children,
  className,
  onClick,
  route,
}: {
  show: boolean
  children: ReactNode
  className?: string
  onClick?: MouseEventHandler<HTMLButtonElement>
  route?: Routes
}) => {
  const audio = useAudioStore((s) => s.initAudio(SFX.BUTTON))

  const content = (
    <button
      onMouseEnter={() => !audio.playing() && audio.play()}
      onClick={onClick}
      className={`relative button-stonecut tracking-widest text-lg focus:outline-none w-max ml-auto mr-auto cursor-pointer select-none ${className}`}
    >
      <div className='button-stonecut__wrapper'>
        <SVGStonecut />
      </div>
      <span className='text-stroke-4 pointer-events-none'>{children}</span>
    </button>
  )

  return (
    <>
      <CSSTransition in={show} timeout={2000} classNames='elem-fade' appear>
        {route ? (
          <Link href={route} as={route}>
            {content}
          </Link>
        ) : (
          content
        )}
      </CSSTransition>
    </>
  )
}

export default ButtonStonecut
