import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame, useThree } from 'react-three-fiber'
import * as THREE from 'three'
import { useControls } from 'leva'

import fragmentShader from '@/components/Journey/Canvas/Scenes/Intro/Clouds/CloudsPlane.fs'
import vertexShader from '@/components/Journey/Canvas/Scenes/Intro/Clouds/CloudsPlane.vs'
import useNumberUniform from '@/hooks/uniforms/useNumberUniform'

const CloudsPlane = () => {
  const [sizeTex, setSizeTex] = useState({ width: 0, height: 0 })
  const clockRef = useRef<THREE.Clock>(new THREE.Clock())

  const { speed } = useControls('clouds', {
    speed: { min: 0, max: 0.5, value: 0.02 },
  })

  const cloudsTexture = useMemo(
    () =>
      new THREE.TextureLoader().load('/img/journey/clouds.png', (t) => {
        const { width, height } = t.image
        setSizeTex({ width, height })
      }),
    []
  )

  cloudsTexture.wrapS = THREE.RepeatWrapping

  const uniforms = useRef<Record<string, THREE.IUniform>>({
    uTexture: { value: cloudsTexture },
    uTime: { value: 0 },
    uSpeed: { value: 0 },
  })

  useNumberUniform(uniforms.current.uSpeed, speed)

  const planeRef = useRef<THREE.Mesh>()
  const vec3Ref = useMemo(() => new THREE.Vector3(), [])

  const { camera, viewport, size } = useThree()

  useEffect(() => {
    const { width, height } = viewport(
      camera,
      planeRef.current?.getWorldPosition(vec3Ref) as THREE.Vector3
    )
    const texRatio = sizeTex.width / sizeTex.height
    const screenRatio = width / height
    if (texRatio > screenRatio) {
      planeRef.current?.scale.set(height * texRatio, height, 1)
    } else {
      planeRef.current?.scale.set(width, width / texRatio, 1)
    }
  }, [sizeTex, size, camera])

  useFrame(() => {
    uniforms.current.uTime.value = clockRef.current.getElapsedTime()
  })

  return (
    <mesh ref={planeRef}>
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

export default CloudsPlane
