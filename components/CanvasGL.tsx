import { Canvas } from 'react-three-fiber'
import ProtoPlane from './3d-components/ProtoPlane/ProtoPlane'
import style from './CanvasGL.module.scss'
import HandNote from './HandNote/HandNote'
import Handtrack from './Handtrack/Handtrack'

const CanvasGL = () => {
  // useEffect(() => subscribeHands(console.log), [])

  return (
    <>
      <Handtrack />
      <HandNote />
      <div className={style['CanvasGL']}>
        <Canvas>
          {/* <Box position={[0, -0.75, 0]} /> */}
          {/* <HelloWorld position={[0, 0.75, 0]} /> */}
          <ProtoPlane />
        </Canvas>
      </div>
    </>
  )
}

export default CanvasGL
