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
  }> & { children: any }
> | null = null
LayoutCanvas = dynamic(() => import('@/components/common/LayoutCanvas'), {
  ssr: false,
})

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()

  let r3fArr: any[] = []
  let compArr: any[] = []
  Children.forEach(
    (Component as any)(pageProps).props.children,
    (child: any) => {
      if (child.props && child.props.r3f) {
        r3fArr.push(child)
      } else {
        compArr.push(child)
      }
    }
  )

  useEffect(() => {
    useUserStore.setState({ router: router as Router })
  }, [router])

  return (
    <>
      <Head />
      {compArr && (
        <LayoutDom>
          {/* <LayoutTransition location={router.pathname}> */}
          {(compArr as unknown) as ReactChild}
          {/* </LayoutTransition> */}
        </LayoutDom>
      )}
      {LayoutCanvas && (
        <LayoutCanvas>{r3fArr && <group>{r3fArr}</group>}</LayoutCanvas>
      )}
    </>
  )
}

export default MyApp
