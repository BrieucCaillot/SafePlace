import { RefObject, useEffect, useMemo, useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { InstancedMeshProps, useFrame } from 'react-three-fiber'
import * as THREE from 'three'

import findMinimumTexSize from '@/utils/FBO/findMinimumTexSize'
import fragmentShader from './Flowers.fs'
import vertexShader from './Flowers.vs'
import useUniform from '@/hooks/uniforms/useUniform'
import useSurfaceSampling from '@/hooks/FBO/useSurfaceSampling'
import useInstancedParticleGeometry from '@/hooks/FBO/useInstancedParticleGeometry'
import useWatchableUniform from '@/hooks/uniforms/useWatchableUniform'

type FlowersParams = {
  size: number
  amount: number
  texture: THREE.Texture
  weightAttribute: string
}

const Flowers = ({
  targetMeshRef,
  shadowTexture = null,
  flowersParams: { size, amount: numPoints, texture, weightAttribute },
  ...props
}: Omit<InstancedMeshProps, 'geometry' | 'material' | 'args' | 'count'> & {
  targetMeshRef: RefObject<THREE.Mesh>
  flowersParams?: FlowersParams
  shadowTexture?: THREE.Texture
}) => {
  // --- STATE
  const instancedMeshRef = useRef<THREE.InstancedMesh>(null)
  const { nodes } = useGLTF('/models/greenery/flower.glb')

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
  const origGeometry = useMemo(
    () => (nodes['near_water_plant'] as THREE.Mesh).geometry,
    [nodes]
  )

  const bufferGeometry = useInstancedParticleGeometry(
    origGeometry,
    textureSize,
    numPoints
  )

  // --- UNIFORMS
  const uniforms = useRef<Record<string, THREE.IUniform>>(
    THREE.UniformsUtils.merge([
      THREE.UniformsLib['fog'],
      {
        uTexture: { value: null },
        uPositionTexture: { value: null },
        uUvTexture: { value: null },
        uGroundTexture: { value: null },
        uSize: { value: 1 },
        uRotation: { value: new THREE.Quaternion() },
      },
    ])
  )

  useUniform(uniforms.current.uTexture, texture)
  useWatchableUniform(uniforms.current.uPositionTexture, positionTexture)
  useWatchableUniform(uniforms.current.uUvTexture, uvTexture)
  useUniform(
    uniforms.current.uGroundTexture,
    shadowTexture ||
      (targetMeshRef.current
        ? (targetMeshRef.current.material as THREE.MeshBasicMaterial).map
        : null)
  )
  useUniform(uniforms.current.uSize, size)

  useEffect(() => {
    instancedMeshRef.current.count = numPoints
  }, [numPoints])

  const o = useMemo(() => new THREE.Object3D(), [])
  const v = useMemo(() => new THREE.Vector3(), [])
  useFrame(({ camera }) => {
    camera.getWorldDirection(v)
    v.y = 0
    o.lookAt(v)
    ;(uniforms.current.uRotation.value as THREE.Quaternion).copy(o.quaternion)
  })

  return (
    <instancedMesh {...props} geometry={bufferGeometry} ref={instancedMeshRef}>
      <shaderMaterial
        alphaTest={0.5}
        transparent={true}
        side={THREE.DoubleSide}
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={uniforms.current}
        fog={true}
      />
    </instancedMesh>
  )
}

export default Flowers
