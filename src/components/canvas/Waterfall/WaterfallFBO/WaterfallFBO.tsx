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
      doesIntersectRef,
    }: {
      scene: RefObject<THREE.Scene>
      quadTexture: WatchableRefObject<THREE.Texture>
      initTexture: WatchableRefObject<THREE.Texture>
      mousePosRef: WatchableRefObject<THREE.Vector3>
      doesIntersectRef: WatchableRefObject<boolean>
    },
    ref: RefObject<THREE.Mesh>
  ) => {
    const clockRef = useRef<THREE.Clock>(new THREE.Clock())
    const {
      baseDirection,
      angleAmplitude,
      movementSpeed,
      lifeTime,
      sdfOffset,
      rounding,
      cursorSize,
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
            value: 1.17,
            min: 0,
            max: 3,
            label: 'Speed',
          },
          lifeTime: { value: 7, label: 'Life Time' },
          sdfOffset: { x: 0.83, y: 3.5, z: -0.26 },
          rounding: { value: 0.66, min: 0, max: 2 },
          cursorSize: { value: 0.15, min: 0, max: 1 },
        },
        { collapsed: true }
      ),
    })

    const uniforms = useRef<Record<string, THREE.IUniform>>({
      uOrigPosTexture: { value: null },
      uPosTexture: { value: null },
      uMousePos: { value: new THREE.Vector3() },
      uDoesIntersect: { value: false },
      uTime: { value: 0 },
      uDelta: { value: 0 },
      uBaseDirection: { value: 0 },
      uAngleAmplitude: { value: 0 },
      uMovementSpeed: { value: 0 },
      uLifeTime: { value: 0 },
      uSdfOffset: { value: new THREE.Vector3() },
      uRounding: { value: 0 },
      uCursorSize: { value: 0 },
    })
    useNumberUniform(uniforms.current.uBaseDirection, baseDirection)
    useNumberUniform(uniforms.current.uAngleAmplitude, angleAmplitude)
    useNumberUniform(uniforms.current.uMovementSpeed, movementSpeed)
    useNumberUniform(uniforms.current.uLifeTime, lifeTime)
    useNumberUniform(uniforms.current.uRounding, rounding)
    useNumberUniform(uniforms.current.uCursorSize, cursorSize)
    useVector3Uniform(uniforms.current.uSdfOffset, sdfOffset)
    useWatchableUniform(uniforms.current.uPosTexture, quadTexture)
    useWatchableUniform(uniforms.current.uOrigPosTexture, initTexture)
    useWatchableUniform(uniforms.current.uMousePos, mousePosRef)
    useWatchableUniform(uniforms.current.uDoesIntersect, doesIntersectRef)

    useFrame(() => {
      uniforms.current.uTime.value = clockRef.current.elapsedTime
      uniforms.current.uDelta.value = clockRef.current.getDelta()
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
