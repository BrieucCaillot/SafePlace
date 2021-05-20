import * as THREE from 'three'
import { useMemo, useRef } from 'react'
import MeshShorthand from '@/components/common/Canvas/MeshShorthand'
import fragmentShader from './Water.fs'
import vertexShader from './Water.vs'
import useNumberUniform from '@/hooks/uniforms/useNumberUniform'
import { useFrame } from 'react-three-fiber'
import useVector3Uniform from '@/hooks/uniforms/useVector3Uniform'

type WaterParams = {
  textureScale: number
  flowSpeed: number
  flowDirection: number
  flowIntensity: number
  hslTransform: { x: number; y: number; z: number }
}

const Water = ({
  targetMesh,
  waterParams,
  shadowTexture,
}: {
  targetMesh: THREE.Mesh
  waterParams: WaterParams
  shadowTexture: THREE.Texture
}) => {
  const clock = useMemo(() => new THREE.Clock(), [])

  const [bg, level_1, level_2] = useMemo(() => {
    const loader = new THREE.TextureLoader()
    return ['water_background.jpg', 'water_niv1.png', 'water_niv2.png'].map(
      (n) =>
        loader.load(`/img/common/water/${n}`, (t) => {
          t.wrapS = THREE.RepeatWrapping
          t.wrapT = THREE.RepeatWrapping
          t.minFilter = THREE.NearestFilter
        })
    )
  }, [])

  const uniforms = useRef<{ [name: string]: THREE.IUniform }>({
    uShadowTexture: { value: shadowTexture },
    uBackground: { value: bg },
    uLevel1: { value: level_1 },
    uLevel2: { value: level_2 },
    uScale: { value: 1 },
    uFlowSpeed: { value: 1 },
    uFlowDirection: { value: 0 },
    uFlowIntensity: { value: 0 },
    uHslTransform: { value: new THREE.Vector3() },
    uTime: { value: 0 },
  })
  useNumberUniform(uniforms.current.uScale, waterParams.textureScale)
  useNumberUniform(uniforms.current.uFlowSpeed, waterParams.flowSpeed)
  useNumberUniform(uniforms.current.uFlowDirection, waterParams.flowDirection)
  useNumberUniform(uniforms.current.uFlowIntensity, waterParams.flowIntensity)
  useVector3Uniform(uniforms.current.uHslTransform, waterParams.hslTransform)
  useFrame(() => (uniforms.current.uTime.value = clock.getElapsedTime()))

  return (
    <MeshShorthand object={targetMesh}>
      <shaderMaterial
        uniforms={uniforms.current}
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
      />
    </MeshShorthand>
  )
}

export default Water
