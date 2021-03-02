import { useEffect, useRef } from 'react'
import { Canvas } from 'react-three-fiber'
import useHandtrackStore from 'stores/useHandtrackStore'
import Box from './3d-components/Box/Box'
import HelloWorld from './3d-components/HelloWorld/HelloWorld'
import style from './CanvasGL.module.scss'

const CanvasGL = () => {
  const videoRef = useRef<HTMLVideoElement>(null)

  const initCamera = useHandtrackStore((s) => s.initCamera)
  const initHands = useHandtrackStore((s) => s.initHands)
  const load = useHandtrackStore((s) => s.load)
  const areHandsLoaded = useHandtrackStore((s) => s.isLoaded)
  const startHands = useHandtrackStore((s) => s.start)
  // const subscribeHands = useHandtrackStore((s) => s.subscribe)

  useEffect(() => {
    if (videoRef.current === null)
      throw new Error('Video element is not loaded')
    initHands()
    initCamera(videoRef.current)
    load()
  }, [])

  useEffect(() => {
    if (areHandsLoaded) startHands()
  }, [areHandsLoaded])

  // useEffect(() => subscribeHands(console.log), [])

  return (
    <>
      <video className={style['video']} ref={videoRef} />
      <div className={style['CanvasGL']}>
        <Canvas>
          <Box position={[0, -0.75, 0]} />
          <HelloWorld position={[0, 0.75, 0]} />
        </Canvas>
      </div>
    </>
  )
}

export default CanvasGL
