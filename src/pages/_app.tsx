import { Children, ComponentType, ReactChild, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useRouter, Router } from 'next/router'
import { AppProps, NextRouter } from 'next/dist/next-server/lib/router/router'
import { ExcludeRouterProps } from 'next/dist/client/with-router'

import '@/styles/style.scss'

import useUserStore from '@/stores/useUserStore'

import Head from '@/components/common/Head'
import LayoutDom from '@/components/common/LayoutDom'
import LayoutTransition from '@/components/common/LayoutTransition'

let LayoutCanvas: ComponentType<
  ExcludeRouterProps<{
    router: NextRouter
  }>
> | null = null
LayoutCanvas = dynamic(() => import('@/components/common/LayoutCanvas'), {
  ssr: false,
})

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()

  useEffect(() => {
    useUserStore.setState({ router: router as Router })
  }, [router])

  return (
    <>
      <Head />
      <LayoutDom>
        <LayoutTransition location={router.pathname}>
          <Component {...pageProps} />
        </LayoutTransition>
      </LayoutDom>
      <LayoutCanvas />
    </>
  )
}

export default MyApp
