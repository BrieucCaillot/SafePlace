import { Canvas } from 'react-three-fiber'
import Box from './3d-components/Box'
import style from './CanvasGL.module.scss'

const CanvasGL = () => {
  return (
    <div className={style['CanvasGL']}>
      <Canvas>
        <Box />
      </Canvas>
    </div>
  )
}

export default CanvasGL
