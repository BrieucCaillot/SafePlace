import dynamic from 'next/dynamic'

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
      <SafeplaceCanvas r3f />
      <SafeplaceDom />
    </>
  )
}

export default Index

export async function getStaticProps() {
  return {
    props: {},
  }
}
