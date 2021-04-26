import { useControls } from 'leva'
import { NextRouter, withRouter } from 'next/router'
import { FC, useEffect } from 'react'

const DebugNavigation: FC<{ router: NextRouter }> = ({ router }) => {
  const { pathname } = router
  const paths = {
    index: '/',
    rules: '/rules',
    safeplace: '/safeplace',
    journey: '/journey',
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
