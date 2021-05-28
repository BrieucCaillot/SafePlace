import { useGLTF } from '@react-three/drei'
import { useControls } from 'leva'
import { useRef } from 'react'
import * as THREE from 'three'
import useColorUniform from '@/hooks/uniforms/useColorUniform'
import fragmentShader from './CustomSky.fs'
import vertexShader from './CustomSky.vs'
import useVector2Uniform from '@/hooks/uniforms/useVector2Uniform'

const CustomSky = () => {
  const {
    nodes: { sky },
  } = useGLTF('/models/sky.glb')

  const { zenithColor, horizonColor, easePoint } = useControls(
    'custom_sky',
    {
      zenithColor: '#7594cb',
      horizonColor: '#e8b7cb',
      easePoint: { x: 0.1, y: 0.5 },
    },
    { collapsed: true }
  )

  const uniforms = useRef<{ [name: string]: THREE.IUniform }>({
    uHorizonColor: { value: new THREE.Color() },
    uZenithColor: { value: new THREE.Color() },
    uEasePoint: { value: new THREE.Vector2() },
  })
  useColorUniform(uniforms.current.uHorizonColor, horizonColor)
  useColorUniform(uniforms.current.uZenithColor, zenithColor)
  useVector2Uniform(uniforms.current.uEasePoint, easePoint)

  return (
    <mesh
      geometry={(sky as THREE.Mesh).geometry}
      scale={[500, 500, 500]}
      frustumCulled={false}
    >
      <shaderMaterial
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={uniforms.current}
      />
    </mesh>
  )
}

export default CustomSky
