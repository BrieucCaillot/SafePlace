import { Stats } from '@react-three/drei'
import CanvasGL from '@/components/CanvasGL'

const Home = () => {
  return (
    <>
      {!!process.browser && <Stats showPanel={0} />}
      <CanvasGL />
    </>
  )
}

export default Home
