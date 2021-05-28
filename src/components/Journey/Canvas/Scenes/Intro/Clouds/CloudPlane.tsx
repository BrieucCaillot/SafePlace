import { useMemo, useRef, useState } from 'react'
import { useFrame } from 'react-three-fiber'
import * as THREE from 'three'

import useNumberUniform from '@/hooks/uniforms/useNumberUniform'
import useFitObjectToCamera from '@/hooks/useFitObjectToCamera'

import fragmentShader from '@/components/Journey/Canvas/Scenes/Intro/Clouds/CloudPlane.fs'
import vertexShader from '@/components/Journey/Canvas/Scenes/Intro/Clouds/CloudPlane.vs'

const CloudPlane = ({
  url,
  scrollSpeed,
}: {
  url: string
  scrollSpeed: number
}) => {
  const planeRef = useRef<THREE.Mesh>()
  const clockRef = useRef<THREE.Clock>(new THREE.Clock())
  const loader = useMemo(() => new THREE.TextureLoader(), [])

  const [ratio, setRatio] = useState(1)
  const scale = useFitObjectToCamera(planeRef, ratio)

  const cloudTexture = useMemo(
    () =>
      loader.load(url, (t) => {
        const { width, height } = t.image
        t.wrapS = THREE.RepeatWrapping
        setRatio(width / height)
      }),
    []
  )

  const uniforms = useRef<Record<string, THREE.IUniform>>({
    uTexture: { value: cloudTexture },
    uTime: { value: 0 },
    uSpeed: { value: 0 },
  })

  useNumberUniform(uniforms.current.uSpeed, scrollSpeed)

  useFrame(() => {
    uniforms.current.uTime.value = clockRef.current.getElapsedTime()
  })

  return (
    <mesh ref={planeRef} scale={scale}>
      <planeGeometry args={[0.5, 0.5, 1]} />
      <rawShaderMaterial
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={uniforms.current}
        transparent={true}
      />
    </mesh>
  )
}

export default CloudPlane
