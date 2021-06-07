import React, { ReactNode, useMemo } from 'react'
import { useRouter } from 'next/router'
import { Leva } from 'leva'

import useSceneStore from '@/stores/useSceneStore'
import Routes from '@/constants/enums/Routes'

import User from '@/components/common/User'
import DebugNavigation from '@/components/common/DebugNavigation'
import LayoutAudio from '@/components/common/LayoutAudio'
import LayoutHeader from '@/components/common/UI/LayoutHeader'
import LayoutGradient from '@/components/common/UI/LayoutGradient'
import LayoutBottom from '@/components/common/UI/LayoutBottom'
import Cursor from '@/components/Journey/UI/Cursor'

const LayoutDom = ({ children }: { children: ReactNode }) => {
  const { pathname } = useRouter()

  const windowAvailable = useMemo(() => typeof window !== 'undefined', [])
  const inTransition = useSceneStore((s) => s.inTransition)
  const isHomeOrAboutPage = useMemo(
    () => [Routes.Index, Routes.About].includes(pathname as Routes),
    [pathname]
  )

  const isLayoutBottomAvailable = useMemo(
    () => !isHomeOrAboutPage && !inTransition,
    [pathname, inTransition]
  )

  return (
    <>
      {windowAvailable && <User />}
      <DebugNavigation />
      <LayoutAudio />
      <LayoutHeader />

      <main className='dom font-serif subpixel-antialiased relative cursor-none pointer-events-none'>
        {isHomeOrAboutPage && <LayoutGradient pathname={pathname} />}
        {/* <Leva hidden={true} /> */}
        {children}
        <LayoutBottom show={isLayoutBottomAvailable} />
        <Cursor />
      </main>
    </>
  )
}

export default LayoutDom
