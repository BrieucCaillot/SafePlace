import React, { ReactNode, useMemo } from 'react'
import { useRouter } from 'next/router'

import User from '@/components/common/User'
import DebugNavigation from '@/components/common/DebugNavigation'
import LayoutHeader from '@/components/common/UI/LayoutHeader'
import LayoutBottom from '@/components/common/UI/LayoutBottom'
import LayoutAudio from '@/components/common/LayoutAudio'
import Routes from '@/constants/enums/Routes'
import { Leva } from 'leva'

const LayoutDom = ({ children }: { children: ReactNode }) => {
  const { pathname } = useRouter()

  const windowAvailable = useMemo(() => typeof window !== 'undefined', [])

  const isLayoutBottmAvailable = useMemo(
    () => pathname !== Routes.Index && pathname !== Routes.About,
    [pathname]
  )

  return (
    <>
      {windowAvailable && <User />}
      <DebugNavigation />
      <LayoutAudio />
      <main className='dom font-serif relative h-screen w-screen z-10 pointer-events-none'>
        <LayoutHeader />
        {isLayoutBottmAvailable && <LayoutBottom />}
        {/* <Leva hidden={true} /> */}
        {children}
      </main>
    </>
  )
}

export default LayoutDom
