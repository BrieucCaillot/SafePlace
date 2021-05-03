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
  const isBridgeSection = useJourneyStore(
    (s) => s.currentSection === JourneySection.Bridge
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
            isBridgeSection
              ? slatAnims.find((a) => a.name.includes(s.name))
              : null
          }
          key={i}
        />
      ))}
    </group>
  )
}

export default Slats
