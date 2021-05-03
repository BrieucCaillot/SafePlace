import JourneySection from '@/constants/enums/JourneySection'
import useJourneyStore from '@/stores/useJourneyStore'
import { useMemo } from 'react'
import Slat from './Slat'

const Slats = ({
  slatGroup,
  slatAnims,
}: {
  slatGroup: THREE.Object3D
  slatAnims: THREE.AnimationClip[]
}) => {
  const slats = useMemo(() => [...slatGroup.children] as THREE.Mesh[], [])
  const animate = useJourneyStore((s) =>
    [
      JourneySection.Bridge,
      JourneySection.Waterfall,
      JourneySection.Outro,
    ].includes(s.currentSection)
  )

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
          key={i}
        />
      ))}
    </group>
  )
}

export default Slats
