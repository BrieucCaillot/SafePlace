import React from 'react'
import { CSSTransition } from 'react-transition-group'

import LayoutSoundButton from '@/components/common/UI/LayoutSoundButton'

const LayoutBottom = ({ show }: { show: boolean }) => {
  return (
    <CSSTransition in={show} timeout={1000} classNames='elem-fade' appear>
      <div
        id='layout-bottom'
        className={`absolute bottom-0 left-0 ${
          show ? 'visible' : 'invisible'
        } w-full px-5 md:px-14 mb-5 flex items-center justify-between`}
      >
        <div id='layout-bottom-left'></div>
        <div
          id='layout-bottom-middle'
          className='flex-grow px-10 sm:px-16 md:px-32 lg:px-40 xl:px-52'
        ></div>
        <div id='layout-bottom-right' className='flex items-center'>
          <LayoutSoundButton />
        </div>
      </div>
    </CSSTransition>
  )
}

export default LayoutBottom
