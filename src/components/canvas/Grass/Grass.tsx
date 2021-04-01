import useNumberUniform from '@/hooks/uniforms/useNumberUniform'
import findMinimumTexSize from '@/utils/FBO/findMinimumTexSize'
import { getPositionTextureFromMesh } from '@/utils/FBO/getPositionTexture'
import { useGLTF } from '@react-three/drei'
import { useControls } from 'leva'
import { useEffect, useMemo, useRef } from 'react'
import { GroupProps, useFrame } from 'react-three-fiber'
import * as THREE from 'three'
import fragmentShader from './Grass.fs'
import vertexShader from './Grass.vs'

const Grass = (props: GroupProps) => {
  // --- STATE

  const targetMeshRef = useRef<THREE.Mesh>(null)
  const instancedMeshRef = useRef<THREE.Mesh>(null)
  const { nodes } = useGLTF('/models/grass.gltf')

  const {
    size,
    windSpeed,
    windAmplitude,
    windNoiseSize,
    grassAmount: numPoints,
  } = useControls(
    'Grass',
    {
      grassAmount: { value: 4096 * 32, step: 1 },
      size: 1,
      windNoiseSize: { value: 0.2, min: 0, max: 1 },
      windAmplitude: { value: 0.3, min: 0, max: 1 },
      windSpeed: 0.2,
    },
    { collapsed: true }
  )

  const textureSize = useMemo<THREE.Vector2Tuple>(
    () => findMinimumTexSize(numPoints),
    [numPoints]
  )
  // const textureSize = useMemo<THREE.Vector2Tuple>(() => [64, 64], [])
  // const numPoints = textureSize[0] * textureSize[1]

  // --- GEOMETRY

  const bufferGeometry = useMemo(() => {
    const bufferGeometry = (nodes['herbe_grp_3003'] as THREE.Mesh).geometry
    const geometry = new THREE.InstancedBufferGeometry()

    Object.keys(bufferGeometry.attributes).forEach((attributeName) => {
      geometry.attributes[attributeName] =
        bufferGeometry.attributes[attributeName]
    })
    geometry.index = bufferGeometry.index

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
      q.setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.random() * Math.PI)
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

  const texture = useMemo(
    () => new THREE.TextureLoader().load('./img/grass.png'),
    []
  )

  const uniforms = useRef<Record<string, THREE.IUniform>>({
    uPositionTexture: { value: null },
    uTexture: { value: texture },
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

  useFrame(({ clock }) => {
    uniforms.current.uTime.value = clock.getElapsedTime()
  })

  useEffect(() => {
    ;(instancedMeshRef.current as THREE.InstancedMesh).count = numPoints
    uniforms.current.uPositionTexture.value = getPositionTextureFromMesh(
      targetMeshRef.current,
      textureSize,
      numPoints
    )
  }, [textureSize[0], textureSize[1], numPoints])

  return (
    <group {...props} rotation-x={-Math.PI / 2}>
      <mesh scale={[1, 1, 1]} ref={targetMeshRef}>
        <planeGeometry args={[500, 500]} />
        <meshBasicMaterial color={0x46765a} />
      </mesh>
      <instancedMesh
        geometry={bufferGeometry}
        position-z={1}
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
