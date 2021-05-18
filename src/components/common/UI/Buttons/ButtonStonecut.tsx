import React, { forwardRef, MouseEventHandler, ReactNode } from 'react'
import Link from 'next/link'

import SVGStonecut from '@/components/common/UI/SVG/SVGStonecut'
import Routes from '@/constants/enums/Routes'

const ButtonStonecut = ({
  children,
  className,
  onClick,
  route,
}: {
  children: ReactNode
  className?: string
  onClick?: MouseEventHandler<HTMLButtonElement>
  route?: Routes
}) => {
  const content = (
    <button
      onClick={onClick}
      className={`relative button-stonecut pointer-events-auto tracking-widest text-lg focus:outline-none w-max ml-auto mr-auto ${className}`}
    >
      <SVGStonecut />
      <span>{children}</span>
    </button>
  )

  return (
    <>
      {route ? (
        <Link href={route} as={route}>
          {content}
        </Link>
      ) : (
        content
      )}
    </>
  )
}

export default ButtonStonecut
