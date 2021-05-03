import { useMemo } from 'react'
import Slat from './Slat'

const Slats = ({
  slatGroup,
  slatAnims,
  animate = false,
  onAnimFinished = () => {},
}: {
  slatGroup: THREE.Object3D
  slatAnims: THREE.AnimationClip[]
  animate?: boolean
  onAnimFinished: (i: number) => void
}) => {
  const slats = useMemo(() => [...slatGroup.children] as THREE.Mesh[], [])

  return (
    <group
      position={slatGroup.position}
      rotation={slatGroup.rotation}
      scale={slatGroup.scale}
    >
      {slats.map((s, i) => (
        <Slat
          slatObject={s}
          slatAnim={
            animate ? slatAnims.find((a) => a.name.includes(s.name)) : null
          }
          onAnimFinished={() => onAnimFinished(i)}
          key={i}
        />
      ))}
    </group>
  )
}

export default Slats
