import dynamic from 'next/dynamic'
import OnBoarding from '@/components/OnBoarding/OnBoarding'
import Bottom from '@/components/common/Bottom/Bottom'

const SafeplaceCanvas = dynamic(
  () => import('@/components/Safeplace/SafeplaceCanvas'),
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
      <SafeplaceCanvas r3f />
      <SafeplaceDom />
      <Bottom />
    </>
  )
}

export default Index

export async function getStaticProps() {
  return {
    props: {},
  }
}
