import { FC, useEffect } from 'react'
import { NextRouter, withRouter } from 'next/router'
import { useControls } from 'leva'

import Routes from '@/constants/enums/Routes'

const DebugNavigation: FC<{ router: NextRouter }> = ({ router }) => {
  const { pathname } = router

  const [{ path }, set] = useControls(() => ({
    path: {
      value: pathname,
      options: Routes,
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
