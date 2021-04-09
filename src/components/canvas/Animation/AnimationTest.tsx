import * as THREE from 'three'
import { useFrame } from 'react-three-fiber'
import { useGLTF } from '@react-three/drei'
import { useEffect, useRef } from 'react'
import { useControls } from 'leva'

const AnimationTest = () => {
  const {
    animations: [anim],
  } = useGLTF('/models/test.glb')

  const meshRef = useRef<THREE.Mesh>()
  const mixerRef = useRef<THREE.AnimationMixer>()
  const actionRef = useRef<THREE.AnimationAction>()
  useEffect(() => {
    if (meshRef.current == null) return
    mixerRef.current = new THREE.AnimationMixer(meshRef.current)

    // Play a specific animation
    actionRef.current = mixerRef.current.clipAction(anim)
    actionRef.current.setLoop(THREE.LoopOnce, 1)
  }, [])

  const { timeScale } = useControls('Animation', {
    playAnimation: {
      type: 'BUTTON',
      value: false,
      onClick: () => {
        if (actionRef.current) actionRef.current.play()
      },
    },
    stopAnimation: {
      type: 'BUTTON',
      value: false,
      onClick: () => {
        if (actionRef.current) actionRef.current.stop()
      },
    },
    timeScale: { value: 1 },
  })

  useEffect(() => {
    if (mixerRef.current == null) return
    mixerRef.current.timeScale = timeScale
  }, [timeScale])

  useFrame(({ clock }) => {
    if (mixerRef.current == null) return
    mixerRef.current.update(clock.getDelta())
    console.log(meshRef.current?.position)
  })

  return (
    <mesh ref={meshRef}>
      <boxBufferGeometry args={[10, 10, 10]} />
      <meshNormalMaterial />
    </mesh>
  )
}

export default AnimationTest
