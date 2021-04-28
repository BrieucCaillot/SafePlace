import {
  forwardRef,
  RefObject,
  useEffect,
  useLayoutEffect,
  useRef,
} from 'react'
import { createPortal, useFrame } from 'react-three-fiber'
import * as THREE from 'three'
import useVector2Uniform from '@/hooks/uniforms/useVector2Uniform'
import fragmentShader from './WaterfallFBO.fs'
import vertexShader from './WaterfallFBO.vs'
import { folder, useControls } from 'leva'
import useNumberUniform from '@/hooks/uniforms/useNumberUniform'
import { WatchableRefObject } from '@/hooks/useWatchableRef'
import useWatchableUniform from '@/hooks/uniforms/useWatchableUniform'
import useVector3Uniform from '@/hooks/uniforms/useVector3Uniform'

const WaterfallFBO = forwardRef(
  (
    {
      scene,
      quadTexture,
      initTexture,
      mousePosRef,
    }: {
      scene: RefObject<THREE.Scene>
      quadTexture: WatchableRefObject<THREE.Texture>
      initTexture: WatchableRefObject<THREE.Texture>
      mousePosRef: WatchableRefObject<THREE.Vector3>
    },
    ref: RefObject<THREE.Mesh>
  ) => {
    const {
      baseDirection,
      angleAmplitude,
      movementSpeed,
      lifeTime,
      sdfOffset,
    } = useControls('particles', {
      'Simulator Params': folder(
        {
          baseDirection: {
            value: Math.PI,
            min: 0,
            max: Math.PI * 2,
            label: 'Direction',
          },
          angleAmplitude: { value: 0.2, min: 0, max: Math.PI, label: 'Angle' },
          movementSpeed: {
            value: 0.06,
            min: 0,
            max: 0.5,
            label: 'Speed',
          },
          lifeTime: { value: 4, label: 'Life Time' },
          sdfOffset: { x: 1, y: 0, z: -1.5 },
        },
        { collapsed: true }
      ),
    })

    const uniforms = useRef<Record<string, THREE.IUniform>>({
      uOrigPosTexture: { value: null },
      uPosTexture: { value: null },
      uMousePos: { value: new THREE.Vector3() },
      uTime: { value: 0 },
      uBaseDirection: { value: 0 },
      uAngleAmplitude: { value: 0 },
      uMovementSpeed: { value: 0 },
      uLifeTime: { value: 0 },
      uSdfOffset: { value: new THREE.Vector3() },
    })
    useNumberUniform(uniforms.current.uBaseDirection, baseDirection)
    useNumberUniform(uniforms.current.uAngleAmplitude, angleAmplitude)
    useNumberUniform(uniforms.current.uMovementSpeed, movementSpeed)
    useNumberUniform(uniforms.current.uLifeTime, lifeTime)
    useVector3Uniform(uniforms.current.uSdfOffset, sdfOffset)
    useWatchableUniform(uniforms.current.uPosTexture, quadTexture)
    useWatchableUniform(uniforms.current.uOrigPosTexture, initTexture)
    useWatchableUniform(uniforms.current.uMousePos, mousePosRef)

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
