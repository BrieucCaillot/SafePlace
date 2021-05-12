import React, { forwardRef, ReactNode } from 'react'
import Link from 'next/link'

import SVGStonecut from '@/components/common/UI/SVG/SVGStonecut'
import Routes from '@/constants/enums/Routes'

const ButtonStonecutContent = forwardRef(
  (
    {
      onClick,
      href,
      children,
      className,
    }: {
      onClick?: any
      href?: any
      children: ReactNode
      className?: string
    },
    ref
  ) => {
    return (
      <button
        href={href}
        onClick={onClick}
        ref={ref}
        className={`relative button-stonecut pointer-events-auto tracking-widest text-lg focus:outline-none w-max ml-auto mr-auto ${className}`}
      >
        <SVGStonecut />
        <span className='text-shadow'>{children}</span>
      </button>
    )
  }
)

const ButtonStonecut = ({
  children,
  className,
  onClick,
  route,
}: {
  children: ReactNode
  className?: string
  onClick?: Function
  route?: Routes
}) => {
  return (
    <>
      {route ? (
        <Link href={route} as={route}>
          <ButtonStonecutContent children={children} className={className} />
        </Link>
      ) : (
        <ButtonStonecutContent
          children={children}
          className={className}
          onClick={onClick}
        />
      )}
    </>
  )
}

export default ButtonStonecut
