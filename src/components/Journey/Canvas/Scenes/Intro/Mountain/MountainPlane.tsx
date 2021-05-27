import { useEffect, useMemo, useRef, useState } from 'react'
import { useThree } from 'react-three-fiber'
import * as THREE from 'three'

import fragmentShader from '@/components/Journey/Canvas/Scenes/Intro/Mountain/MountainPlane.fs'
import vertexShader from '@/components/Journey/Canvas/Scenes/Intro/Mountain/MountainPlane.vs'

const MountainPlane = () => {
  const [sizeTex, setSizeTex] = useState({ width: 0, height: 0 })

  const backgroundTexture = useMemo(
    () =>
      new THREE.TextureLoader().load('/img/journey/background.jpg', (t) => {
        const { width, height } = t.image
        setSizeTex({ width, height })
      }),
    []
  )

  const uniforms = useRef<Record<string, THREE.IUniform>>({
    uTexture: { value: backgroundTexture },
  })

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

  return (
    <mesh ref={planeRef}>
      <planeGeometry />
      <rawShaderMaterial
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={uniforms.current}
      />
    </mesh>
  )
}

export default MountainPlane
