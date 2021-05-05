import { ReactNode, RefObject, useEffect, useMemo, useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GroupProps, useFrame } from 'react-three-fiber'
import { useControls } from 'leva'
import * as THREE from 'three'

import useNumberUniform from '@/hooks/uniforms/useNumberUniform'
import findMinimumTexSize from '@/utils/FBO/findMinimumTexSize'
import { getPositionTextureFromMesh } from '@/utils/FBO/getPositionTexture'
import fragmentShader from './Grass.fs'
import vertexShader from './Grass.vs'
import Routes from '@/constants/enums/Routes'

const Grass = ({
  children,
  ...props
}: GroupProps & {
  children: (ref: RefObject<THREE.Mesh>) => ReactNode
}) => {
  // --- STATE

  const targetMeshRef = useRef<THREE.Mesh>(null)
  const instancedMeshRef = useRef<THREE.Mesh>(null)
  const { nodes } = useGLTF('/models/safeplace/grass.gltf')

  const textures = useMemo(() => {
    const loaders = new THREE.TextureLoader()
    return {
      grass_1: loaders.load('/img/common/grass_1.png'),
      grass_2: loaders.load('/img/common/grass_2.png'),
      grass_3: loaders.load('/img/common/grass_3.png'),
    }
  }, [])

  const {
    size,
    windSpeed,
    windAmplitude,
    windNoiseSize,
    grassAmount: numPoints,
    texture,
  } = useControls(
    'grass',
    {
      texture: { value: textures['grass_2'], options: textures },
      grassAmount: { value: 24576, step: 1 },
      size: 0.4,
      windNoiseSize: { value: 0.2, min: 0, max: 1 },
      windAmplitude: { value: 0.07, min: 0, max: 1 },
      windSpeed: 0.2,
    },
    {
      collapsed: true,
      render: (s) => s('path') === Routes.Safeplace,
    }
  )

  const textureSize = useMemo<THREE.Vector2Tuple>(
    () => findMinimumTexSize(numPoints),
    [numPoints]
  )
  // const textureSize = useMemo<THREE.Vector2Tuple>(() => [64, 64], [])
  // const numPoints = textureSize[0] * textureSize[1]

  // --- GEOMETRY

  const origGeometry = useMemo(() => {
    const g = (nodes['herbe_grp_3003'] as THREE.Mesh).geometry
    g.rotateX(-Math.PI / 2)
    return g
  }, [nodes])

  const bufferGeometry = useMemo(() => {
    const geometry = new THREE.InstancedBufferGeometry()

    Object.keys(origGeometry.attributes).forEach((attributeName) => {
      geometry.attributes[attributeName] =
        origGeometry.attributes[attributeName]
    })
    geometry.index = origGeometry.index

    const index = new Float32Array(numPoints)

    for (let i = 0; i < numPoints; i++) index[i] = i
    geometry.setAttribute(
      'aIndex',
      new THREE.InstancedBufferAttribute(index, 1, false)
    )

    const pixelPos = new Float32Array(numPoints * 2)
    for (let i = 0; i < numPoints; i++) {
      pixelPos[i * 2] = (i % textureSize[0]) / textureSize[0]
      pixelPos[i * 2 + 1] = Math.floor(i / textureSize[0]) / textureSize[1]
    }
    geometry.setAttribute(
      'aPixelPosition',
      new THREE.InstancedBufferAttribute(pixelPos, 2, false)
    )

    const rotationArray = new Float32Array(numPoints * 4)
    const q = new THREE.Quaternion()
    for (let i = 0; i < numPoints; i++) {
      q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.random() * Math.PI)
      rotationArray[i * 4 + 0] = q.x
      rotationArray[i * 4 + 1] = q.y
      rotationArray[i * 4 + 2] = q.z
      rotationArray[i * 4 + 3] = q.w
    }
    geometry.setAttribute(
      'aRotation',
      new THREE.InstancedBufferAttribute(rotationArray, 4, false)
    )

    return geometry
  }, [numPoints, textureSize[0], textureSize[1]])

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
  useNumberUniform(uniforms.current.uSize, size)
  useNumberUniform(uniforms.current.uWindAmplitude, windAmplitude)
  useNumberUniform(uniforms.current.uWindNoiseSize, windNoiseSize)
  useNumberUniform(uniforms.current.uWindSpeed, windSpeed)
  useEffect(() => {
    uniforms.current.uTexture.value = texture
  }, [texture])

  useFrame(({ clock }) => {
    uniforms.current.uTime.value = clock.getElapsedTime()
  })

  useEffect(() => {
    ;(instancedMeshRef.current as THREE.InstancedMesh).count = numPoints
    const [positionTexture, uvTexture] = getPositionTextureFromMesh(
      targetMeshRef.current,
      textureSize,
      numPoints
    )
    uniforms.current.uPositionTexture.value = positionTexture
    uniforms.current.uUvTexture.value = uvTexture
    uniforms.current.uGroundTexture.value = (targetMeshRef.current
      .material as THREE.MeshBasicMaterial).map
  }, [textureSize[0], textureSize[1], numPoints])

  return (
    <group {...props}>
      {children(targetMeshRef)}
      <instancedMesh
        geometry={bufferGeometry}
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
    </group>
  )
}

export default Grass
