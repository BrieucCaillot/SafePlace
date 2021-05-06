import { RefObject, useEffect, useMemo, useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { InstancedMeshProps, useFrame } from 'react-three-fiber'
import * as THREE from 'three'

import findMinimumTexSize from '@/utils/FBO/findMinimumTexSize'
import fragmentShader from './Grass.fs'
import vertexShader from './Grass.vs'
import useUniform from '@/hooks/uniforms/useUniform'
import useSurfaceSampling from '@/hooks/FBO/useSurfaceSampling'
import useInstancedParticleGeometry from '@/hooks/FBO/useInstancedParticleGeometry'
import useWatchableUniform from '@/hooks/uniforms/useWatchableUniform'

type GrassParams = {
  size: number
  windSpeed: number
  windAmplitude: number
  windNoiseSize: number
  amount: number
  texture: THREE.Texture
  weightAttribute: string
}

const Grass = ({
  targetMeshRef,
  shadowTexture = null,
  grassParams: {
    size,
    windSpeed,
    windAmplitude,
    windNoiseSize,
    amount: numPoints,
    texture,
    weightAttribute,
  },
  ...props
}: Omit<InstancedMeshProps, 'geometry' | 'material' | 'args' | 'count'> & {
  targetMeshRef: RefObject<THREE.Mesh>
  grassParams?: GrassParams
  shadowTexture?: THREE.Texture
}) => {
  // --- STATE
  const instancedMeshRef = useRef<THREE.InstancedMesh>(null)
  const clockRef = useRef<THREE.Clock>(new THREE.Clock())
  const { nodes } = useGLTF('/models/greenery/grass.gltf')

  const textureSize = useMemo<THREE.Vector2Tuple>(
    () => findMinimumTexSize(numPoints),
    [numPoints]
  )

  const [positionTexture, uvTexture] = useSurfaceSampling(
    targetMeshRef,
    textureSize,
    numPoints,
    weightAttribute
  )

  // --- GEOMETRY

  const origGeometry = useMemo(() => {
    const g = (nodes['herbe_grp_3003'] as THREE.Mesh).geometry
    g.rotateX(-Math.PI / 2)
    return g
  }, [nodes])

  const bufferGeometry = useInstancedParticleGeometry(
    origGeometry,
    textureSize,
    numPoints
  )
  const rotatedBufferGeometry = useMemo(() => {
    const rotationArray = new Float32Array(numPoints * 4)
    const q = new THREE.Quaternion()
    const upVector = new THREE.Vector3(0, 1, 0)
    for (let i = 0; i < numPoints; i++) {
      q.setFromAxisAngle(upVector, Math.random() * Math.PI)
      rotationArray[i * 4 + 0] = q.x
      rotationArray[i * 4 + 1] = q.y
      rotationArray[i * 4 + 2] = q.z
      rotationArray[i * 4 + 3] = q.w
    }
    bufferGeometry.setAttribute(
      'aRotation',
      new THREE.InstancedBufferAttribute(rotationArray, 4, false)
    )
    return bufferGeometry
  }, [bufferGeometry])

  // --- UNIFORMS
  const uniforms = useRef<Record<string, THREE.IUniform>>({
    uPositionTexture: { value: null },
    uUvTexture: { value: null },
    uTexture: { value: null },
    uGroundTexture: { value: null },
    uTime: { value: 0 },
    uSize: { value: 1 },
    uWindAmplitude: { value: 0 },
    uWindNoiseSize: { value: 0 },
    uWindSpeed: { value: 0 },
  })
  useUniform(uniforms.current.uSize, size)
  useUniform(uniforms.current.uWindAmplitude, windAmplitude)
  useUniform(uniforms.current.uWindNoiseSize, windNoiseSize)
  useUniform(uniforms.current.uWindSpeed, windSpeed)
  useUniform(uniforms.current.uTexture, texture)
  useWatchableUniform(uniforms.current.uUvTexture, uvTexture)
  useWatchableUniform(uniforms.current.uPositionTexture, positionTexture)
  useUniform(
    uniforms.current.uGroundTexture,
    shadowTexture ||
      (targetMeshRef.current.material as THREE.MeshBasicMaterial).map
  )

  useEffect(() => {
    instancedMeshRef.current.count = numPoints
  }, [numPoints])

  useFrame(() => {
    uniforms.current.uTime.value = clockRef.current.getElapsedTime()
  })

  return (
    <instancedMesh
      {...props}
      geometry={rotatedBufferGeometry}
      position-y={size + 0.05}
      ref={instancedMeshRef}
    >
      <shaderMaterial
        alphaTest={0.5}
        transparent={true}
        side={THREE.DoubleSide}
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={uniforms.current}
      />
    </instancedMesh>
  )
}

export default Grass
