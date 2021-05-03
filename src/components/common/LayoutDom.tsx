import React, { ReactNode, useMemo } from 'react'

import User from '@/components/common/User'
import DebugNavigation from '@/components/common/DebugNavigation'
import LayoutHeader from '@/components/common/UI/LayoutHeader'
import LayoutBottom from '@/components/common/UI/LayoutBottom'
import { Leva } from 'leva'

const LayoutDom = ({ children }: { children: ReactNode }) => {
  const windowAvailable = useMemo(() => typeof window !== 'undefined', [])

  return (
    <>
      {windowAvailable && <User />}
      <DebugNavigation />
      <div className='dom font-serif relative h-screen w-screen z-10 pointer-events-none'>
        <LayoutHeader />
        <LayoutBottom />
        <Leva hidden={true} />
        {children}
      </div>
    </>
  )
}

export default LayoutDom
