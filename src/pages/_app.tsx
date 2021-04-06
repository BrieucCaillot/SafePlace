import { Children, ComponentType } from 'react'
import Head from '@/components/common/Head'
import dynamic from 'next/dynamic'
import LayoutDom from '@/components/layout/LayoutDom'
import '@/styles/style.scss'

let LayoutCanvas: ComponentType<{ children: any }> | null = null
LayoutCanvas = dynamic(() => import('@/components/layout/LayoutCanvas'), {
  ssr: false,
})

function SplitApp({ canvas, dom }) {
  return (
    <>
      <Head />
      {dom && <LayoutDom dom={dom} />}
      {LayoutCanvas && (
        <LayoutCanvas>{canvas && <group>{canvas}</group>}</LayoutCanvas>
      )}
    </>
  )
}

function MyApp({ Component, pageProps }) {
  let r3fArr: any[] = []
  let compArr: any[] = []
  Children.forEach(Component(pageProps).props.children, (child: any) => {
    if (child.props && child.props.r3f) {
      r3fArr.push(child)
    } else {
      compArr.push(child)
    }
  })

  return (
    <>
      <SplitApp canvas={r3fArr} dom={compArr} />
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
