import React, { ReactNode } from 'react'
import LayoutBottom from '@/components/common/UI/LayoutBottom'
import SafeplaceTimeline from '@/components/Safeplace/UI/SafeplaceTimeline'
import LayoutSound from '@/components/common/UI/LayoutSound'

const LayoutDom = ({ dom }: { dom: ReactNode }) => {
  return (
    <div className='dom font-serif relative h-screen w-screen z-10 pointer-events-none'>
      <LayoutBottom>
        <div id='layout-bottom-left'></div>
        <div id='layout-bottom-right'>
          <LayoutSound />
        </div>
      </LayoutBottom>
      {dom}
    </div>
  )
}

export default LayoutDom
