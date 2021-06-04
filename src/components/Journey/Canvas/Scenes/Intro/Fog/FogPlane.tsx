import { useMemo, useRef, useState } from 'react'
import { useFrame } from 'react-three-fiber'
import * as THREE from 'three'

import useNumberUniform from '@/hooks/uniforms/useNumberUniform'
import useFitObjectToCamera from '@/hooks/three/useFitObjectToCamera'

import fragmentShader from '@/components/Journey/Canvas/Scenes/Intro/Fog/FogPlane.fs'
import vertexShader from '@/components/Journey/Canvas/Scenes/Intro/Fog/FogPlane.vs'

const FogPlane = ({
  speed,
  size,
}: {
  speed: number
  size: THREE.Vector3Tuple
}) => {
  const planeRef = useRef<THREE.Mesh>()

  const [ratio, setRatio] = useState(1)
  const scale = useFitObjectToCamera(planeRef, ratio)

  const clockRef = useRef<THREE.Clock>(new THREE.Clock())

  const fogTexture = useMemo(
    () =>
      new THREE.TextureLoader().load('/img/journey/intro/fog.png', (t) => {
        const { width, height } = t.image
        // t.wrapS = THREE.MirroredRepeatWrapping
        setRatio(width / height)
      }),
    []
  )

  const uniforms = useRef<Record<string, THREE.IUniform>>({
    uTexture: { value: fogTexture },
    uTime: { value: 0 },
    uSpeed: { value: 0 },
  })

  useNumberUniform(uniforms.current.uSpeed, speed / 10)

  useFrame(() => {
    uniforms.current.uTime.value = clockRef.current.getElapsedTime()
  })

  return (
    <mesh ref={planeRef} scale={scale}>
      <planeGeometry args={size} />
      <rawShaderMaterial
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={uniforms.current}
        transparent={true}
      />
    </mesh>
  )
}

export default FogPlane
