import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'

const FlyingRocks = ({ flyingRocks }: { flyingRocks: THREE.Object3D }) => {
  const rocks = useMemo(() => flyingRocks.children[0], [])
  const groupRef = useRef<THREE.Object3D>()

  useEffect(() => {
    gsap.to(groupRef.current.position, {
      y: flyingRocks.position.y + 1,
      duration: 10,
      repeat: -1,
      repeatDelay: 1,
      ease: 'sine.inOut',
      yoyo: true,
      yoyoEase: true,
    })
  }, [])

  return (
    <group ref={groupRef} position={flyingRocks.position}>
      <mesh {...rocks} />
    </group>
  )
}

export default FlyingRocks
