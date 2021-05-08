import { forwardRef, ReactNode } from 'react'

import SVGStonecut from '@/components/common/UI/SVG/SVGStonecut'

const ButtonStonecut = forwardRef(
  (
    {
      onClick,
      href,
      children,
      className,
      color,
    }: {
      onClick?: any
      href?: any
      children: ReactNode
      className?: string
      color?: 'primary' | 'secondary' | 'tertiary'
    },
    ref
  ) => {
    return (
      <button
        href={href}
        onClick={onClick}
        ref={ref}
        className={`relative button-stonecut pointer-events-auto tracking-widest text-lg focus:outline-none w-max ml-auto mr-auto text-${color} ${className}`}
      >
        <SVGStonecut />
        <span className='text-shadow'>{children}</span>
      </button>
    )
  }
)

export default ButtonStonecut
