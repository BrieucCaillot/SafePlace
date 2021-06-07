import { useEffect, useMemo, useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { InstancedMeshProps, useFrame } from 'react-three-fiber'
import * as THREE from 'three'

import fragmentShader from './Birds.fs'
import vertexShader from './Birds.vs'
import { useControls } from 'leva'
import Routes from '@/constants/enums/Routes'
import useNumberUniform from '@/hooks/uniforms/useNumberUniform'
import useColorUniform from '@/hooks/uniforms/useColorUniform'
import randomVectorInCone from '@/utils/math/randomVectorInCone'
import usePrevious from '@/hooks/usePrevious'

const Birds = ({
  points,
}: Omit<InstancedMeshProps, 'geometry' | 'material' | 'args' | 'count'> & {
  points: THREE.Object3D[]
}) => {
  // --- STATE
  const instancedMeshRef = useRef<THREE.InstancedMesh>(null)
  const { nodes } = useGLTF('/models/journey/bird.glb')
  const clock = useMemo(() => new THREE.Clock(true), [])

  const {
    particleAmount: numPoints,
    size,
    sequence,
    color,
    timeVariation,
    spreadAngle,
    speed,
    speedVar,
    wingSpeed,
    wingAmplitude,
  } = useControls(
    'cairns.birds',
    {
      size: 0.1,
      sequence: { value: 0, step: 1 },
      color: '#292e4e',
      timeVariation: 0.3,
      particleAmount: { value: 50, step: 1 },
      spreadAngle: { min: 0, max: Math.PI, value: 0.3 },
      speed: 7,
      speedVar: { min: 0, max: 1, value: 0.34 },
      wingSpeed: 15,
      wingAmplitude: { min: 0, max: Math.PI / 2, value: Math.PI / 4 },
    },
    { collapsed: true, render: (s) => s('path') === Routes.Journey }
  )

  const previousSequence = usePrevious(sequence)

  // --- GEOMETRY

  const origGeometry = useMemo(() => (nodes['bird'] as THREE.Mesh).geometry, [
    nodes,
  ])

  const bufferGeometry = useMemo(() => {
    const geometry = new THREE.InstancedBufferGeometry()

    geometry.instanceCount = numPoints

    Object.keys(origGeometry.attributes).forEach((attributeName) => {
      geometry.attributes[attributeName] =
        origGeometry.attributes[attributeName]
    })
    geometry.index = origGeometry.index

    const positions = new Float32Array(numPoints * 3)
    const directions = new Float32Array(numPoints * 4)
    const sequenceArray = new Float32Array(numPoints)
    const index = new Float32Array(numPoints)

    const v = new THREE.Vector3()
    const q = new THREE.Quaternion()
    const up = new THREE.Vector3(0, 0, 1)

    for (let i = 0; i < numPoints; i++) {
      const pointIndex = Math.floor((i / numPoints) * points.length)
      const point = points[pointIndex]

      index[i] = i

      sequenceArray[i] = pointIndex
      positions[i * 3 + 0] = point.position.x
      positions[i * 3 + 1] = point.position.y
      positions[i * 3 + 2] = point.position.z

      randomVectorInCone(spreadAngle, v)
      q.setFromUnitVectors(up, v)
      q.multiply(point.quaternion)

      directions[i * 4 + 0] = q.x
      directions[i * 4 + 1] = q.y
      directions[i * 4 + 2] = q.z
      directions[i * 4 + 3] = q.w
    }
    geometry.setAttribute(
      'aPosition',
      new THREE.InstancedBufferAttribute(positions, 3, false)
    )
    geometry.setAttribute(
      'aSequence',
      new THREE.InstancedBufferAttribute(sequenceArray, 1, false)
    )
    geometry.setAttribute(
      'aDirection',
      new THREE.InstancedBufferAttribute(directions, 4, false)
    )
    geometry.setAttribute(
      'aIndex',
      new THREE.InstancedBufferAttribute(index, 1, false)
    )

    return geometry
  }, [numPoints, spreadAngle, points])

  // --- UNIFORMS
  // Uniforms
  const uniforms = useRef<Record<string, THREE.IUniform>>({
    ...THREE.UniformsLib['fog'],
    uSize: { value: 0 },
    uTimeVariation: { value: 0.5 },
    uColor: { value: new THREE.Color() },
    uSpeed: { value: 0 },
    uSpeedVar: { value: 0 },
    uTime: { value: 0 },
    uWingSpeed: { value: 0 },
    uWingAmplitude: { value: 0 },
    uSequenceTimestamp: {
      value: new Array(points.length).fill(100000),
    },
  })
  useColorUniform(uniforms.current.uColor, color)
  useNumberUniform(uniforms.current.uSize, size)
  useNumberUniform(uniforms.current.uTimeVariation, timeVariation)
  useNumberUniform(uniforms.current.uSpeed, speed)
  useNumberUniform(uniforms.current.uWingSpeed, wingSpeed)
  useNumberUniform(uniforms.current.uWingAmplitude, wingAmplitude)
  useNumberUniform(uniforms.current.uSpeedVar, speedVar)

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

  useEffect(() => {
    instancedMeshRef.current.count = numPoints
  }, [numPoints])

  useFrame(() => {
    uniforms.current.uTime.value = clock.getElapsedTime()
  })

  return (
    <instancedMesh geometry={bufferGeometry} ref={instancedMeshRef}>
      <shaderMaterial
        side={THREE.DoubleSide}
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={uniforms.current}
      />
    </instancedMesh>
  )
}

export default Birds
