import { forwardRef, RefObject, useEffect, useRef } from 'react'
import { createPortal, useFrame } from 'react-three-fiber'
import * as THREE from 'three'
import useVector2Uniform from '@/hooks/uniforms/useVector2Uniform'
import fragmentShader from './WaterfallFBO.fs'
import vertexShader from './WaterfallFBO.vs'
import { useControls } from 'leva'
import useNumberUniform from '@/hooks/uniforms/useNumberUniform'

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

    const {
      baseDirection,
      angleAmplitude,
      movementSpeed,
      lifeTime,
    } = useControls('Particles', {
      baseDirection: {
        value: Math.PI / 2,
        min: 0,
        max: Math.PI * 2,
        label: 'Direction',
      },
      angleAmplitude: { value: 0.17, min: 0, max: Math.PI, label: 'Angle' },
      movementSpeed: {
        value: 0.06,
        min: 0,
        max: 0.1,
        label: 'Speed',
      },
      lifeTime: { value: 2, label: 'Life Time' },
    })

    const uniforms = useRef<Record<string, THREE.IUniform>>({
      uSize: { value: new THREE.Vector2() },
      uOrigPosTexture: { value: null },
      uPosTexture: { value: null },
      uMousePos: { value: new THREE.Vector3() },
      uTime: { value: 0 },
      uBaseDirection: { value: 0 },
      uAngleAmplitude: { value: 0 },
      uMovementSpeed: { value: 0 },
      uLifeTime: { value: 0 },
    })
    useVector2Uniform(uniforms.current.uSize, size)
    useNumberUniform(uniforms.current.uBaseDirection, baseDirection)
    useNumberUniform(uniforms.current.uAngleAmplitude, angleAmplitude)
    useNumberUniform(uniforms.current.uMovementSpeed, movementSpeed)
    useNumberUniform(uniforms.current.uLifeTime, lifeTime)

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
