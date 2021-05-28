import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'

import useFitObjectToCamera from '@/hooks/useFitObjectToCamera'
import useNumberUniform from '@/hooks/uniforms/useNumberUniform'

import fragmentShader from '@/components/Journey/Canvas/Scenes/Intro/Mountain/MountainPlane.fs'
import vertexShader from '@/components/Journey/Canvas/Scenes/Intro/Mountain/MountainPlane.vs'
import { useFrame } from 'react-three-fiber'

const MountainPlane = ({
  displacement,
  easing,
}: {
  displacement: number
  easing: number
}) => {
  const planeRef = useRef<THREE.Mesh>()
  const mouseRef = useRef(new THREE.Vector2())

  const [sizeTex, setSizeTex] = useState({ width: 0, height: 0 })
  const scale = useFitObjectToCamera(planeRef, sizeTex.width / sizeTex.height)

  const backgroundTexture = useMemo(
    () =>
      new THREE.TextureLoader().load(
        '/img/journey/intro/background.jpg',
        (t) => {
          const { width, height } = t.image
          setSizeTex({ width, height })
        }
      ),
    []
  )

  const depthMap = useMemo(
    () => new THREE.TextureLoader().load('/img/journey/intro/depthMap.png'),
    []
  )

  const uniforms = useRef<Record<string, THREE.IUniform>>({
    uTexture: { value: backgroundTexture },
    uDepthMap: { value: depthMap },
    uDisplacementAmount: { value: 0 },
    uMousePos: { value: new THREE.Vector2() },
  })

  useNumberUniform(uniforms.current.uDisplacementAmount, displacement)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }

    window.addEventListener('mousemove', handleMouseMove)

    return () => void window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useFrame(() => {
    uniforms.current.uMousePos.value.lerp(mouseRef.current, easing)
  })

  return (
    <mesh
      ref={planeRef}
      scale={[
        scale[0] + displacement * 12,
        scale[1] + displacement * 12,
        scale[2],
      ]}
    >
      <planeGeometry />
      <rawShaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms.current}
      />
    </mesh>
  )
}

export default MountainPlane
