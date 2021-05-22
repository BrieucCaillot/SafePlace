import { useEffect, useMemo, useRef } from 'react'
import gsap from 'gsap'

import usePrevious from '@/hooks/usePrevious'
import Routes from '@/constants/enums/Routes'

const HEIGHT = 230

const LayoutGradient = ({ pathname }: { pathname: string }) => {
  const gradientRef = useRef<HTMLDivElement>(null)
  const isHomePage = useMemo(() => pathname === Routes.Index, [pathname])
  const isAboutPage = useMemo(() => pathname === Routes.About, [pathname])

  const previousPathname = usePrevious(pathname)

  useEffect(() => {
    if (previousPathname === undefined) {
      gsap.set(gradientRef.current, {
        height: `${HEIGHT}%`,
        bottom: isHomePage ? 0 : `-${HEIGHT - 100}%`,
      })
    } else {
      gsap.to(gradientRef.current, {
        bottom: isHomePage ? 0 : `-${HEIGHT - 100}%`,
        duration: 1.5,
      })
    }
  }, [previousPathname, isHomePage, isAboutPage])

  return (
    <div
      ref={gradientRef}
      className='gradient-main absolute bottom-0 h-full w-full'
    ></div>
  )
}

export default LayoutGradient
