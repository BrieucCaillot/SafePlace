import * as THREE from 'three'
import { useMemo, useRef } from 'react'
import MeshShorthand from '@/components/common/Canvas/MeshShorthand'
import fragmentShader from './Water.fs'
import vertexShader from './Water.vs'
import { useControls } from 'leva'
import useNumberUniform from '@/hooks/uniforms/useNumberUniform'
import { useFrame } from 'react-three-fiber'
import useColorUniform from '@/hooks/uniforms/useColorUniform'
import useVector3Uniform from '@/hooks/uniforms/useVector3Uniform'

const Water = ({ targetMesh }: { targetMesh: THREE.Mesh }) => {
  const clock = useMemo(() => new THREE.Clock(), [])
  const controls = useControls(
    'water',
    {
      textureScale: 3.2,
      flowSpeed: 0.05,
      flowDirection: { value: 0.2, min: 0, max: Math.PI },
      flowIntensity: 0.04,
      hslTransform: { value: { x: 1.06, y: 0.6, z: 1.06 } },
    },
    { collapsed: true }
  )

  const [bg, level_1, level_2] = useMemo(() => {
    const loader = new THREE.TextureLoader()
    return ['water_background.jpg', 'water_niv1.png', 'water_niv2.png'].map(
      (n) =>
        loader.load(`/img/common/water/${n}`, (t) => {
          t.wrapS = THREE.RepeatWrapping
          t.wrapT = THREE.RepeatWrapping
        })
    )
  }, [])

  const uniforms = useRef<{ [name: string]: THREE.IUniform }>({
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
  useNumberUniform(uniforms.current.uScale, controls.textureScale)
  useNumberUniform(uniforms.current.uFlowSpeed, controls.flowSpeed)
  useNumberUniform(uniforms.current.uFlowDirection, controls.flowDirection)
  useNumberUniform(uniforms.current.uFlowIntensity, controls.flowIntensity)
  useVector3Uniform(uniforms.current.uHslTransform, controls.hslTransform)
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
