import { Stats } from '@react-three/drei'
import CanvasGL from 'components/CanvasGL'
import { env } from 'process'

const Home = () => {
  return (
    <>
      {!!process.browser && <Stats showPanel={0} />}
      <CanvasGL />
    </>
  )
}

export default Home
