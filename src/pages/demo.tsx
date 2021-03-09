import dynamic from 'next/dynamic'

const SafePlace = dynamic(
  () => import('@/components/canvas/Sphere/safeplace/safeplace'),
  {
    ssr: false,
  }
)

const Demo = () => {
  return (
    <>
      <SafePlace r3f />
    </>
  )
}

export default Demo

export async function getStaticProps() {
  return {
    props: {},
  }
}
