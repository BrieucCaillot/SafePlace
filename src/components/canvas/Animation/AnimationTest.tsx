import * as THREE from 'three'
import { useFrame } from 'react-three-fiber'
import { useGLTF } from '@react-three/drei'
import { useEffect, useRef } from 'react'
import { useControls } from 'leva'

const AnimationTest = () => {
  const { animations } = useGLTF('/models/journey/chapter3.glb')
  // const { animations } = useGLTF('/models/test_cam_mouvement.gltf')

  const meshRef = useRef<THREE.Mesh>()
  const mixerRef = useRef<THREE.AnimationMixer>()
  const actionRef = useRef<THREE.AnimationAction>()
  const clockRef = useRef<THREE.Clock>(new THREE.Clock(true))
  useEffect(() => {
    if (meshRef.current == null) return
    mixerRef.current = new THREE.AnimationMixer(meshRef.current)
  }, [])

  const { timeScale, index } = useControls('Animation', {
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
    index: { value: 0, step: 1 },
  })

  useEffect(() => {
    actionRef.current = mixerRef.current.clipAction(animations[index])
    actionRef.current.setLoop(THREE.LoopOnce, 1)
  }, [index])

  useEffect(() => {
    if (mixerRef.current == null) return
    mixerRef.current.timeScale = timeScale
  }, [timeScale])

  useFrame(() => {
    if (mixerRef.current == null) return
    mixerRef.current.update(clockRef.current.getDelta())
  }, 1)

  return (
    <mesh ref={meshRef}>
      <boxBufferGeometry args={[1, 1, 1]} />
      <meshNormalMaterial />
    </mesh>
  )
}

export default AnimationTest
