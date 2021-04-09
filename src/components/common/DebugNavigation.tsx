import { useControls } from 'leva'
import { NextRouter, withRouter } from 'next/router'
import { useEffect } from 'react'

const DebugNavigation = ({ router }: { router: NextRouter }) => {
  const { pathname } = router
  const paths = {
    index: '/',
    safeplace: '/safeplace',
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
