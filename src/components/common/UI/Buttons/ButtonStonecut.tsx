import React, { MouseEventHandler, ReactNode } from 'react'
import { CSSTransition } from 'react-transition-group'
import Link from 'next/link'

import SVGStonecut from '@/components/common/UI/SVG/SVGStonecut'
import Routes from '@/constants/enums/Routes'

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
  const content = (
    <button
      onClick={onClick}
      className={`relative button-stonecut tracking-widest text-lg focus:outline-none w-max ml-auto mr-auto ${className}`}
    >
      <div className='button-stonecut__wrapper'>
        <SVGStonecut />
      </div>
      <span className='text-stroke-4'>{children}</span>
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
