import { useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from 'react-three-fiber'
import { useControls } from 'leva'
import vertexShader from '@/components/Safeplace/SafeplaceGround/safeplaceGroundVertex.vert'
import fragmentShader from '@/components/Safeplace/SafeplaceGround/safeplaceGroundFragment.frag'
import useColorUniform from '@/hooks/uniforms/useColorUniform'
import useVector2Uniform from '@/hooks/uniforms/useVector2Uniform'

const SafeplaceGround = () => {
  const { color, frequency } = useControls('Safeplace Ground', {
    color: '#6eb46b',
    frequency: {
      x: 0,
      y: 0,
    },
  })

  const uniforms = useRef<{ [name: string]: THREE.IUniform }>({
    uTime: { value: 0 },
    uFrequency: { value: new THREE.Vector2() },
    uColor: { value: new THREE.Color() },
  })

  useColorUniform(uniforms.current.uColor, color)
  useVector2Uniform(uniforms.current.uFrequency, frequency)

  useFrame(({ clock }) => {
    uniforms.current.uTime.value = clock.elapsedTime
  })

  return (
    <mesh
      name={'Safeplace Ground'}
      position={[0, 0, -200]}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <planeGeometry args={[500, 500, 32, 32]} />
      <rawShaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms.current}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

export default SafeplaceGround
