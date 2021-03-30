import useNumberUniform from '@/hooks/uniforms/useNumberUniform'
import getPositionTexture from '@/utils/getPositionTexture'
import { useGLTF } from '@react-three/drei'
import { useControls } from 'leva'
import { useEffect, useMemo, useRef } from 'react'
import { GroupProps, useFrame } from 'react-three-fiber'
import * as THREE from 'three'
import fragmentShader from './fragmentShader.frag'
import vertexShader from './vertexShader.vert'

const Grass = (props: GroupProps) => {
  // --- STATE

  const targetMeshRef = useRef<THREE.Mesh>(null)
  const ref = useRef<THREE.Mesh>(null)
  const { nodes } = useGLTF('/models/grass.gltf')

  const textureSize = useMemo<THREE.Vector2Tuple>(() => [64, 64], [])
  const numPoints = textureSize[0] * textureSize[1]

  const { size, windSpeed, windAmplitude, windNoiseSize } = useControls(
    'Grass',
    {
      windNoiseSize: 0.2,
      windAmplitude: 0.3,
      windSpeed: 0.2,
      size: 1,
    },
    { collapsed: false }
  )

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
    uniforms.current.uPositionTexture.value = getPositionTexture(
      targetMeshRef.current,
      textureSize
    )
  }, [textureSize[0], textureSize[1]])

  return (
    <group {...props} rotation-x={-Math.PI / 2}>
      <mesh scale={[1, 1, 1]} ref={targetMeshRef}>
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial color={0x46765a} />
      </mesh>
      <instancedMesh
        geometry={bufferGeometry}
        position-z={1}
        args={[null as any, null as any, numPoints]}
        ref={ref}
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
