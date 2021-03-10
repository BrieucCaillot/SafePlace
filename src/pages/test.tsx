import dynamic from 'next/dynamic'
import Title from '@/components/common/Title'

const Sphere = dynamic(() => import('@/components/canvas/Sphere/Sphere'), {
  ssr: false,
})

const Test = () => {
  return (
    <>
      <Sphere r3f />
      <Title title='Title test' />
    </>
  )
}

export default Test

export async function getStaticProps() {
  return {
    props: {},
  }
}
