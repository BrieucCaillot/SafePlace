import { useEffect, useMemo, useRef } from 'react'
import { GroupProps, useFrame, useThree } from 'react-three-fiber'
import * as THREE from 'three'
import { folder, useControls } from 'leva'

import fragmentShader from './Dandelion.fs'
import vertexShader from './Dandelion.vs'
import Routes from '@/constants/enums/Routes'
import useColorUniform from '@/hooks/uniforms/useColorUniform'
import useNumberUniform from '@/hooks/uniforms/useNumberUniform'
import findMinimumTexSize from '@/utils/FBO/findMinimumTexSize'
import { getRandomRotationTexture } from '@/utils/FBO/getPositionTexture'
import useVector3Uniform from '@/hooks/uniforms/useVector3Uniform'
import usePrevious from '@/hooks/usePrevious'

const lettersSequence = [
  ['L', 'M', 'N', 'Q', 'R', 'S', 'W', 'X'],
  ['F', 'H', 'J', 'K'],
  ['A', 'B', 'C', 'D'],
  ['E', 'G', 'P', 'V', 'Z'],
]

const Dandelion = ({
  points,
  sequence,
  ...props
}: GroupProps & { points: THREE.Object3D[]; sequence: number }) => {
  const meshRef = useRef<THREE.Mesh>(null)

  const clock = useMemo(() => new THREE.Clock(), [])

  const {
    particleAmount: numPoints,
    // sequence,

    particlesSize,
    sizeVariation,
    timeVariation,
    spreadFactor,

    alpha,
    startColor,
    endColor,
    windDirection,

    windSpeed,
    windEase,
    windEaseDuration,
    detachSpeed,
    detachEase,
    detachEaseDuration,
  } = useControls(
    'dandelion',
    {
      // sequence: 0,
      ease: folder(
        {
          windSpeed: { value: 0.2, step: 0.01 },
          windEase: { value: 0.77, min: 0, max: 1 },
          windEaseDuration: { value: 0.16, min: 0, max: 2 },
          detachSpeed: { value: 0.05, step: 0.01 },
          detachEase: { value: 0.45, min: 0, max: 1 },
          detachEaseDuration: { value: 1.36, min: 0, max: 2 },
        },
        { collapsed: true }
      ),
      aspect: folder(
        {
          particlesSize: 150,
          sizeVariation: 1,
          alpha: { value: 1, min: 0, max: 1 },
          startColor: '#ffe997',
          endColor: '#ad7979',
        },
        { collapsed: true }
      ),
      timeVariation: 6,
      particleAmount: { value: 16 * 62, step: 1 },
      spreadFactor: { value: 0.015, min: 0, max: 1 },
      windDirection: [1, 7, -1],
    },
    { collapsed: true, render: (s) => s('path') === Routes.Journey }
  )
  const previousSequence = usePrevious(sequence)

  const bufferSize = useMemo(() => findMinimumTexSize(numPoints), [numPoints])

  const { gl } = useThree()

  // Uniforms
  const uniforms = useRef<Record<string, THREE.IUniform>>({
    uPosTexture: { value: null },

    uSpreadFactor: { value: 0 },
    uSize: { value: 0 },
    uSizeVariation: { value: 0 },
    uTimeVariation: { value: 0.5 },

    uAlpha: { value: 0 },
    uStartColor: { value: new THREE.Color() },
    uEndColor: { value: new THREE.Color() },

    uDetachSpeed: { value: 0 },
    uDetachEase: { value: 0 },
    uDetachEaseDuration: { value: 0 },

    uWindSpeed: { value: 0 },
    uWindEase: { value: 0 },
    uWindEaseDuration: { value: 0 },

    uWindDirection: { value: new THREE.Vector3() },

    uTime: { value: 0 },
    uSequenceTimestamp: {
      value: new Array(lettersSequence.length).fill(100000),
    },
  })

  useNumberUniform(uniforms.current.uSize, particlesSize * gl.getPixelRatio())
  useNumberUniform(uniforms.current.uSizeVariation, sizeVariation)
  useNumberUniform(uniforms.current.uSpreadFactor, spreadFactor)

  useNumberUniform(uniforms.current.uAlpha, alpha)
  useColorUniform(uniforms.current.uStartColor, startColor)
  useColorUniform(uniforms.current.uEndColor, endColor)

  useNumberUniform(uniforms.current.uWindEase, windEase)
  useNumberUniform(uniforms.current.uWindSpeed, windSpeed)
  useNumberUniform(uniforms.current.uWindEaseDuration, windEaseDuration)
  useNumberUniform(uniforms.current.uDetachEase, detachEase)
  useNumberUniform(uniforms.current.uDetachSpeed, detachSpeed)
  useNumberUniform(uniforms.current.uDetachEaseDuration, detachEaseDuration)

  useNumberUniform(uniforms.current.uTimeVariation, timeVariation)
  useVector3Uniform(uniforms.current.uWindDirection, windDirection)
  useEffect(() => {
    uniforms.current.uPosTexture.value = getRandomRotationTexture(
      bufferSize,
      numPoints
    )
  }, [bufferSize[0], bufferSize[1], numPoints])

  // Update sequence timestamp
  useEffect(() => {
    const difference = sequence - previousSequence
    const sequenceUniform = uniforms.current.uSequenceTimestamp
    for (let index = 0; index < Math.abs(difference); index++) {
      const indexOffset = difference > 0 ? index : -index - 1
      const newValue =
        difference > 0
          ? clock.elapsedTime // Start animation
          : 100000 // Reset animation
      sequenceUniform.value[previousSequence + indexOffset] = newValue
    }
  }, [sequence, previousSequence])

  const bufferGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry()

    const positions = new Float32Array(numPoints * 3)
    const sequenceArray = new Float32Array(numPoints)

    for (let i = 0; i < numPoints; i++) {
      const point = points[Math.floor((i / numPoints) * points.length)]
      const index = lettersSequence.findIndex((letterArray) => {
        for (const letter of letterArray)
          if (point.name.startsWith(letter)) return true
      })

      sequenceArray[i] = index
      positions[i * 3 + 0] = point.position.x
      positions[i * 3 + 1] = point.position.y
      positions[i * 3 + 2] = point.position.z
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute(
      'aSequence',
      new THREE.BufferAttribute(sequenceArray, 1)
    )

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

  useFrame(() => (uniforms.current.uTime.value = clock.getElapsedTime()))

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
