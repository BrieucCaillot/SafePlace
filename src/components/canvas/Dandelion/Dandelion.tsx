import { useCallback, useEffect, useMemo, useRef } from 'react'
import { GroupProps, useThree } from 'react-three-fiber'
import * as THREE from 'three'
import { useControls } from 'leva'
import EasingFunctions from 'easing-functions'
import gsap from 'gsap'

import fragmentShader from './Dandelion.fs'
import vertexShader from './Dandelion.vs'
import Routes from '@/constants/enums/Routes'
import useColorUniform from '@/hooks/uniforms/useColorUniform'
import useNumberUniform from '@/hooks/uniforms/useNumberUniform'
import findMinimumTexSize from '@/utils/FBO/findMinimumTexSize'
import { getRandomRotationTexture } from '@/utils/FBO/getPositionTexture'
import useVector3Uniform from '@/hooks/uniforms/useVector3Uniform'
import useWatchableRef from '@/hooks/useWatchableRef'
import useWatchableUniform from '@/hooks/uniforms/useWatchableUniform'

const Dandelion = ({
  points,
  animate = false,
  ...props
}: GroupProps & { points: THREE.Vector3[]; animate?: boolean }) => {
  const meshRef = useRef<THREE.Mesh>(null)

  const animRef = useRef<gsap.core.Tween>()
  const animationProgress = useWatchableRef(0)

  const startAnimation = useCallback(() => {
    if (animRef.current) animRef.current.kill()
    animRef.current = gsap.fromTo(
      animationProgress,
      { current: 0 },
      {
        current: 1,
        ease: EasingFunctions.Linear.None,
        duration: 10,
      }
    )
  }, [])
  const resetAnimation = useCallback(() => {
    if (animRef.current) animRef.current.kill()
    animationProgress.current = 0
  }, [])

  useEffect(() => {
    if (animate) startAnimation()
    else resetAnimation()
  }, [animate])

  const {
    particlesSize,
    sizeVariation,
    alpha,
    startColor,
    endColor,
    spreadFactor,
    windDirection,
    particleAmount: numPoints,
  } = useControls(
    'dandelion',
    {
      particlesSize: 30,
      particleAmount: { value: 16 * 62, step: 1 },
      sizeVariation: 1,
      spreadFactor: { value: 0.015, min: 0, max: 1 },
      alpha: { value: 1, min: 0, max: 1 },
      startColor: '#ffe997',
      endColor: '#ad7979',
      windDirection: [1, 7, -1],
      // startAnimation: {
      //   type: 'BUTTON',
      //   onClick: startAnimation,
      //   value: false,
      // },
      // resetAnimation: {
      //   type: 'BUTTON',
      //   onClick: resetAnimation,
      //   value: false,
      // },
    },
    { collapsed: true, render: (s) => s('path') === Routes.Journey }
  )

  const bufferSize = useMemo(() => findMinimumTexSize(numPoints), [numPoints])

  const { gl } = useThree()

  const uniforms = useRef<Record<string, THREE.IUniform>>({
    uPosTexture: { value: null },
    uSize: { value: 0 },
    uSpreadFactor: { value: 0 },
    uSizeVariation: { value: 0 },
    uWindDirection: { value: new THREE.Vector3() },
    uAlpha: { value: 0 },
    uAnimationProgress: { value: 0 },
    uStartColor: { value: new THREE.Color() },
    uEndColor: { value: new THREE.Color() },
  })

  useNumberUniform(uniforms.current.uSize, particlesSize * gl.getPixelRatio())
  useNumberUniform(uniforms.current.uSizeVariation, sizeVariation)
  useNumberUniform(uniforms.current.uAlpha, alpha)
  useNumberUniform(uniforms.current.uSpreadFactor, spreadFactor)
  useColorUniform(uniforms.current.uStartColor, startColor)
  useColorUniform(uniforms.current.uEndColor, endColor)
  useVector3Uniform(uniforms.current.uWindDirection, windDirection)
  useWatchableUniform(uniforms.current.uAnimationProgress, animationProgress)

  useEffect(() => {
    uniforms.current.uPosTexture.value = getRandomRotationTexture(
      bufferSize,
      numPoints
    )
  }, [bufferSize[0], bufferSize[1], numPoints])

  const bufferGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry()

    // positions
    const positions = new Float32Array(numPoints * 3)

    for (let i = 0; i < numPoints; i++) {
      const point = points[Math.floor((i / numPoints) * points.length)]
      positions[i * 3 + 0] = point.x
      positions[i * 3 + 1] = point.y
      positions[i * 3 + 2] = point.z
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    const pixelPos = new Float32Array(numPoints * 2)
    for (let i = 0; i < numPoints; i++) {
      pixelPos[i * 2] = (i % bufferSize[0]) / bufferSize[0]
      pixelPos[i * 2 + 1] = Math.floor(i / bufferSize[0]) / bufferSize[1]
    }
    geometry.setAttribute(
      'aPixelPosition',
      new THREE.BufferAttribute(pixelPos, 2, false)
    )

    return geometry
  }, [numPoints, bufferSize[0], bufferSize[1]])

  return (
    <group {...props}>
      <mesh ref={meshRef} visible={false}>
        <icosahedronGeometry args={[0.05, 2]} />
        <meshBasicMaterial color='red' wireframe={true} />
      </mesh>
      <points geometry={bufferGeometry}>
        <shaderMaterial
          transparent={true}
          uniforms={uniforms.current}
          fragmentShader={fragmentShader}
          vertexShader={vertexShader}
        />
      </points>
    </group>
  )
}

export default Dandelion
