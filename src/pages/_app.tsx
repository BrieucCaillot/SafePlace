import { Children, ComponentType, ReactChild, ReactNode } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { AppProps, NextRouter } from 'next/dist/next-server/lib/router/router'

import Head from '@/components/common/Head'
import LayoutDom from '@/components/common/LayoutDom'
import LayoutTransition from '@/components/common/LayoutTransition'
import '@/styles/style.scss'
import { ExcludeRouterProps } from 'next/dist/client/with-router'

let LayoutCanvas: ComponentType<
  ExcludeRouterProps<{
    router: NextRouter
  }> & { children: any }
> | null = null
LayoutCanvas = dynamic(() => import('@/components/common/LayoutCanvas'), {
  ssr: false,
})

function MyApp({ Component, pageProps }: AppProps) {
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
