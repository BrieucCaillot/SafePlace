import { Component, Suspense, useRef } from 'react'
import { Environment, shaderMaterial, Sphere } from '@react-three/drei'
import { useControls } from 'leva'
import useAnimateVector from '@/hooks/animation/useAnimateVector'
import * as THREE from 'three'
import vertex from './vertexShader.vert'
import fragment from './fragmentShader.frag'
import useColorUniform from '@/hooks/uniforms/useColorUniform'
import useBooleanUniform from '@/hooks/uniforms/useBooleanUniform'

const SphereComponent = () => {
  const {
    moveLight,
    lightColor,
    darkColor,
    debugLight,
    debugNormal,
  } = useControls('sphere_material', {
    lightColor: '#800202',
    darkColor: '#000000',
    moveLight: true,
    debugLight: false,
    debugNormal: false,
  })

  const uniforms = useRef<{ [name: string]: THREE.IUniform }>({
    uDebugNormal: { value: false },
    uDebugLight: { value: false },
    uLightColor: { value: new THREE.Color() },
    uDarkColor: { value: new THREE.Color() },
    uLightDirection: { value: new THREE.Vector3() },
  })
  useColorUniform(uniforms.current.uLightColor, lightColor)
  useColorUniform(uniforms.current.uDarkColor, darkColor)
  useBooleanUniform(uniforms.current.uDebugNormal, debugNormal)
  useBooleanUniform(uniforms.current.uDebugLight, debugLight)

  const meshRef = useRef<THREE.Mesh>()
  useAnimateVector(
    uniforms.current.uLightDirection,
    moveLight ? [1, 1, 1] : [1, 1, -1],
    { duration: 0.7 }
  )

  return (
    <>
      <Suspense fallback={null}>
        <ambientLight intensity={0.5} />
        <Sphere args={[1, 32, 32]} ref={meshRef}>
          <rawShaderMaterial
            uniforms={uniforms.current}
            fragmentShader={fragment}
            vertexShader={vertex}
          />
        </Sphere>
        <Environment preset={'studio'} />
      </Suspense>
    </>
  )
}

export default SphereComponent
