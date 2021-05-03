import useThreeAnimation from '@/hooks/animation/useThreeAnimation'
import { useRef } from 'react'
import * as THREE from 'three'
const Slat = ({
  slatObject,
  slatAnim,
  onAnimFinished,
}: {
  slatObject: THREE.Mesh
  slatAnim: THREE.AnimationClip
  onAnimFinished: (e: THREE.Event) => void
}) => {
  const slatRef = useRef<THREE.Mesh>(null)
  useThreeAnimation({
    clip: slatAnim,
    ref: slatRef,
    onFinished: onAnimFinished,
  })
  return (
    <mesh
      position={slatObject.position}
      rotation={slatObject.rotation}
      scale={slatObject.scale}
      geometry={slatObject.geometry}
      material={slatObject.material}
      ref={slatRef}
    />
  )
}

export default Slat
