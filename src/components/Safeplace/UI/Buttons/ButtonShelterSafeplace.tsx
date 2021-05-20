import { useMemo } from 'react'
import Link from 'next/link'
import { CSSTransition } from 'react-transition-group'

import Routes from '@/constants/enums/Routes'

import SVGReturn from '@/components/Safeplace/UI/SVG/SVGReturn'
import SVGRight from '@/components/Safeplace/UI/SVG/SVGRight'
import ButtonParticles from '@/components/Safeplace/UI/Buttons/ButtonParticles'

const ButtonShelterSafeplace = ({
  show,
  direction,
}: {
  show: boolean
  direction: 'left' | 'right'
}) => {
  const position = useMemo(
    () => (direction === 'left' ? 'left-5' : 'right-5'),
    []
  )

  return (
    <CSSTransition
      in={show}
      timeout={2000}
      classNames='elem-fade'
      mountOnEnter
      unmountOnExit
      appear
    >
      <div
        className={`absolute ${position} top-1/2 transform-gpu translate-y-1/2 text-tertiary duration-2000`}
      >
        <div className='relative'>
          <ButtonParticles direction={direction} />

          <Link href={Routes.Safeplace} as={Routes.Safeplace}>
            <div
              className={`shape shape-shelter-arrow shape-shelter-arrow__${direction} pointer-events-auto relative cursor-pointer`}
            >
              {direction === 'left' ? (
                <SVGReturn />
              ) : (
                <SVGRight className='transform-gpu scale-125' />
              )}
            </div>
          </Link>
        </div>
      </div>
    </CSSTransition>
  )
}

export default ButtonShelterSafeplace