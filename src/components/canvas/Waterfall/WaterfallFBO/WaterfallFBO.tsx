import { useRef } from 'react'
import { createPortal, useFrame } from 'react-three-fiber'
import * as THREE from 'three'

const WaterfallFBO = ({ fbo }: { fbo: THREE.WebGLRenderTarget }) => {
  const scene = useRef<THREE.Scene>(new THREE.Scene())

  const cameraRef = useRef<THREE.Camera>(null)
  const cubeRef = useRef<THREE.Mesh>(null)

  useFrame(({ gl }) => {
    if (cameraRef.current === null || cubeRef.current === null) return
    cubeRef.current.rotateX(0.01)
    cubeRef.current.rotateY(0.005)
    gl.setRenderTarget(fbo)
    gl.render(scene.current, cameraRef.current)
    gl.setRenderTarget(null)
  }, 1)

  return createPortal(
    <>
      <orthographicCamera
        args={[-2, 2, 2, -2]}
        position-z={6}
        ref={cameraRef}
      />
      <mesh scale={[1, 1, 1]} ref={cubeRef}>
        <boxGeometry />
        <meshNormalMaterial side={THREE.DoubleSide} />
      </mesh>
    </>,
    scene.current
  ) as JSX.Element
}

export default WaterfallFBO
