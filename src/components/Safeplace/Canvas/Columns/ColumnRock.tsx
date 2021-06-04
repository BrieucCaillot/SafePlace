import React, { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'

import MeshShorthand from '@/components/common/Canvas/MeshShorthand'

const ColumnRock = ({
  rock,
  canRotate,
}: {
  rock: THREE.Mesh
  canRotate: boolean
}) => {
  const rockRef = useRef<THREE.Mesh>()
  const rockRotation = useMemo(() => rock.rotation, [rockRef])
  const [hover, setHover] = useState(false)

  useEffect(() => {
    gsap.to(rockRef.current.position, {
      y: rockRef.current.position.y + 0.12,
      duration: Math.floor(Math.random() * (7 - 5 + 1) + 5),
      repeat: -1,
      repeatDelay: 1,
      ease: 'sine.inOut',
      yoyo: true,
      yoyoEase: true,
    })
  }, [])

  useEffect(() => {
    if (!canRotate) return
    gsap.to(rockRef.current.rotation, {
      y: hover ? rockRotation.y + 0.5 : rockRotation.y,
      duration: 2,
      ease: 'sine.inOut',
    })
  }, [canRotate, hover])

  return (
    <MeshShorthand
      ref={rockRef}
      object={rock}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    />
  )
}

export default ColumnRock
