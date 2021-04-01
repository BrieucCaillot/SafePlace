import dynamic from 'next/dynamic'
import OnBoarding from '@/components/OnBoarding/OnBoarding'
import Bottom from '@/components/common/Bottom/Bottom'
import SafeplaceCamera from '@/components/canvas/Camera/SafeplaceCamera'

const SafeplaceScene = dynamic(
  () => import('@/components/Safeplace/SafeplaceScene'),
  {
    ssr: false,
  }
)

const SafeplaceDom = dynamic(
  () => import('@/components/Safeplace/SafeplaceDom'),
  {
    ssr: false,
  }
)

const Index = () => {
  return (
    <>
      {/* <OnBoarding /> */}
      <SafeplaceCamera r3f />
      <SafeplaceScene r3f />
      <SafeplaceDom />
      <Bottom />
    </>
  )
}

export default Index
