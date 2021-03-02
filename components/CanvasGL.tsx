import { Canvas } from 'react-three-fiber'
import Box from './3d-components/Box/Box'
import HelloWorld from './3d-components/HelloWorld/HelloWorld'
import style from './CanvasGL.module.scss'

const CanvasGL = () => {
  return (
    <div className={style['CanvasGL']}>
      <Canvas>
        <Box position={[0, -0.75, 0]} />
        <HelloWorld position={[0, 0.75, 0]} />
      </Canvas>
    </div>
  )
}

export default CanvasGL
