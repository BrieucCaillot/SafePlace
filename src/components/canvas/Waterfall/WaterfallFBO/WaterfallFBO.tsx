import { forwardRef, RefObject, useEffect, useRef } from 'react'
import { createPortal, useFrame } from 'react-three-fiber'
import * as THREE from 'three'
import useVector2Uniform from '@/hooks/uniforms/useVector2Uniform'
import fragmentShader from './WaterfallFBO.fs'
import vertexShader from './WaterfallFBO.vs'

const WaterfallFBO = forwardRef(
  (
    {
      scene,
      size,
    }: { scene: RefObject<THREE.Scene>; size: THREE.Vector2Tuple },
    ref: RefObject<THREE.Mesh>
  ) => {
    useEffect(() => {
      if (scene.current === null) return
      scene.current.background = new THREE.Color('black')
    }, [])

    const uniforms = useRef<Record<string, THREE.IUniform>>({
      uSize: { value: new THREE.Vector2() },
      uOrigPosTexture: { value: null },
      uPosTexture: { value: null },
      uTime: { value: 0 },
    })
    useVector2Uniform(uniforms.current.uSize, size)

    useFrame(({ clock }) => {
      uniforms.current.uTime.value = clock.getElapsedTime()
    })

    return createPortal(
      <mesh scale={[1, 1, 1]} ref={ref}>
        <planeGeometry />
        <shaderMaterial
          uniforms={uniforms.current}
          fragmentShader={fragmentShader}
          vertexShader={vertexShader}
        />
      </mesh>,
      scene.current
    ) as JSX.Element
  }
)

export default WaterfallFBO
