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
      <SVGStonecut />
      <span>{children}</span>
    </button>
  )

  return (
    <>
      {route ? (
        <CSSTransition
          in={show}
          timeout={{
            appear: 2000,
            enter: 2000,
            exit: 0,
          }}
          exit={false}
          classNames='elem-fade'
          mountOnEnter
          appear
        >
          <Link href={route} as={route}>
            {content}
          </Link>
        </CSSTransition>
      ) : (
        content
      )}
    </>
  )
}

export default ButtonStonecut
