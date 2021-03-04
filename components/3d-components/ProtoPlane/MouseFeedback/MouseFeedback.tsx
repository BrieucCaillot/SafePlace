import { useEffect, useRef, useState } from 'react'
import { useFrame, useThree } from 'react-three-fiber'
import useHandtrackStore from 'stores/useHandtrackStore'
import * as THREE from 'three'
import { lerp } from 'utils/math'
import fragmentShader from './fragmentShader.frag'
import vertexShader from './vertexShader.vert'

const MouseFeedback = () => {
  const uniforms = useRef<{ [name: string]: THREE.IUniform }>({
    uTexture: { value: new THREE.TextureLoader().load('textures/hand.png') },
  })

  const [screenRatio, setScreenRatio] = useState<number>(1)

  useEffect(() => {
    if (!process.browser) return
    const updateRatio = () => {
      setScreenRatio(window.innerWidth / window.innerHeight)
    }
    updateRatio()
    window.addEventListener('resize', updateRatio)
    return () => window.removeEventListener('resize', updateRatio)
  }, [])

  const meshRef = useRef<THREE.Mesh>(null)

  const cursor = useHandtrackStore((s) => s.cursor)
  const cursorTarget = useHandtrackStore((s) => s.cursorTarget)
  const updateCursor = useHandtrackStore((s) => s.updateCursor)

  useFrame(() => {
    updateCursor(
      lerp(cursor.x, cursorTarget.x, 0.1),
      lerp(cursor.y, cursorTarget.y, 0.1)
    )
    meshRef.current?.position.set(
      (-cursor.x + 0.5) * screenRatio,
      -cursor.y + 0.5,
      0
    )
  })

  return (
    <mesh ref={meshRef}>
      <planeBufferGeometry args={[0.1, 0.1]} />
      <rawShaderMaterial
        uniforms={uniforms.current}
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        transparent={true}
      />
    </mesh>
  )
}

export default MouseFeedback
