import dynamic from 'next/dynamic'
import Go from '@/components/dom/title'
import Hand from '@/components/dom/Hand'

const Sphere = dynamic(() => import('@/components/canvas/Sphere/Sphere'), {
  ssr: false,
})

const Index = () => {
  return (
    <>
      <Sphere r3f />
      <Go />
      <Hand />
    </>
  )
}

export default Index

export async function getStaticProps() {
  return {
    props: {},
  }
}
