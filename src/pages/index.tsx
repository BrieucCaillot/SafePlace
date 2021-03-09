import dynamic from 'next/dynamic'
import Go from '@/components/dom/title'

const Sphere = dynamic(() => import('@/components/canvas/Sphere/Sphere'), {
  ssr: false,
})

const Index = () => {
  return (
    <>
      <Sphere r3f />
      <Go />
    </>
  )
}

export default Index

export async function getStaticProps() {
  return {
    props: {},
  }
}
