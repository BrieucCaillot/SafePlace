import { forwardRef, RefObject, useEffect, useRef } from 'react'
import { createPortal } from 'react-three-fiber'
import * as THREE from 'three'
import fragmentShader from './fragmentShader.frag'
import vertexShader from './vertexShader.vert'

const WaterfallFBO = forwardRef(
  (
    { scene }: { scene: RefObject<THREE.Scene> },
    ref: RefObject<THREE.Mesh>
  ) => {
    useEffect(() => {
      if (scene.current === null) return
      scene.current.background = new THREE.Color('black')
    }, [])

    // const cameraRef = useRef<THREE.Camera>(null)
    const uniforms = useRef<Record<string, THREE.IUniform>>({
      uTexture: { value: null },
    })

    // useFrame(({ gl }) => {
    //   if (cameraRef.current === null) return
    //   gl.setRenderTarget(fbo)
    //   gl.render(scene.current, cameraRef.current)
    //   gl.setRenderTarget(null)
    // }, 1)

    return createPortal(
      <>
        {/* <orthographicCamera
        args={[-0.5, 0.5, 0.5, -0.5]}
        position-z={6}
        ref={cameraRef}
      /> */}
        <mesh scale={[1, 1, 1]} ref={ref}>
          <planeGeometry />
          <shaderMaterial
            uniforms={uniforms.current}
            fragmentShader={fragmentShader}
            vertexShader={vertexShader}
          />
        </mesh>
      </>,
      scene.current
    ) as JSX.Element
  }
)

export default WaterfallFBO
