import React, { ReactNode } from 'react'

import DebugNavigation from './DebugNavigation'
import LayoutBottom from '@/components/common/UI/LayoutBottom'
import LayoutSoundButton from '@/components/common/UI/LayoutSoundButton'
import LayoutSoundManager from '@/components/common/LayoutSoundManager'

const LayoutDom = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <DebugNavigation />
      <div className='dom font-serif relative h-screen w-screen z-10 pointer-events-none'>
        <LayoutBottom>
          <div id='layout-bottom-left'></div>
          <div
            id='layout-bottom-middle'
            className='flex-grow px-10 sm:px-16 md:px-32 lg:px-40 xl:px-52'
          ></div>
          <div
            id='layout-bottom-right'
            className='flex items-center flex-row-reverse'
          >
            <div>
              <LayoutSoundManager />
              <LayoutSoundButton />
            </div>
          </div>
        </LayoutBottom>
        {children}
      </div>
    </>
  )
}

export default LayoutDom
