import { FC, useEffect } from 'react'
import { NextRouter, withRouter } from 'next/router'
import { useControls } from 'leva'

import Routes from '@/constants/enums/Routes'

const DebugNavigation: FC<{ router: NextRouter }> = ({ router }) => {
  const { pathname } = router
  const paths = {
    index: Routes.Index,
    about: Routes.About,
    onboarding: Routes.OnBoarding,
    safeplace: Routes.Safeplace,
    resources: Routes.Resources,
    resourceFocus: Routes.ResourcesFocus,
    journey: Routes.Journey,
  }

  const [{ path }, set] = useControls(() => ({
    path: {
      value: pathname,
      options: paths,
    },
  }))

  useEffect(() => {
    set({ path: pathname })
  }, [pathname])
  useEffect(() => {
    if (router.pathname !== path) router.push(path)
  }, [path])

  return null
}

export default withRouter(DebugNavigation)
