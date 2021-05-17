import React, { ReactNode, useMemo } from 'react'
import { useRouter } from 'next/router'

import Routes from '@/constants/enums/Routes'

import User from '@/components/common/User'
import DebugNavigation from '@/components/common/DebugNavigation'
import LayoutHeader from '@/components/common/UI/LayoutHeader'
import LayoutBottom from '@/components/common/UI/LayoutBottom'
import LayoutAudio from '@/components/common/LayoutAudio'
import useSceneStore from '@/stores/useSceneStore'

const LayoutDom = ({ children }: { children: ReactNode }) => {
  const { pathname } = useRouter()

  const windowAvailable = useMemo(() => typeof window !== 'undefined', [])
  const inTransition = useSceneStore((s) => s.inTransition)

  const isLayoutBottomAvailable = useMemo(
    () =>
      ![Routes.Index, Routes.About].includes(pathname as Routes) &&
      !inTransition,
    [pathname, inTransition]
  )

  return (
    <>
      {windowAvailable && <User />}
      <DebugNavigation />
      <LayoutAudio />
      <main className='dom font-serif relative h-screen w-screen z-10 pointer-events-none'>
        <LayoutHeader />
        <LayoutBottom show={isLayoutBottomAvailable} />
        {/* <Leva hidden={true} /> */}
        {children}
      </main>
    </>
  )
}

export default LayoutDom
