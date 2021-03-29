import { Children, ComponentType } from 'react'
import Header from '../config'
import dynamic from 'next/dynamic'
import Dom from '@/components/layout/_dom'
import '@/styles/index.scss'

let LCanvas: ComponentType<{ children: any }> | null = null
if (process.env.NODE_ENV === 'production') {
  LCanvas = dynamic(() => import('@/components/layout/_canvas'), {
    ssr: false,
  })
} else {
  LCanvas = require('@/components/layout/_canvas').default
}

function SplitApp({ canvas, dom }) {
  return (
    <>
      <script src='https://cdn.jsdelivr.net/npm/@tensorflow/tfjs'></script>
      <script src='https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm/dist/tf-backend-wasm.js'></script>
      <Header />
      {dom && <Dom dom={dom} />}
      {LCanvas && <LCanvas>{canvas && <group>{canvas}</group>}</LCanvas>}
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

  return r3fArr.length > 0 ? (
    <SplitApp canvas={r3fArr} dom={compArr} />
  ) : (
    <Component {...pageProps} />
  )
}

export default MyApp
