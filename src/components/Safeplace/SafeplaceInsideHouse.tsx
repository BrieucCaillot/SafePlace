import { PointerEvent } from 'react-three-fiber'
import useSafeplaceStore, { SafeplacePOI } from '@/stores/useSafeplaceStore'
import SafeplaceInteraction from '@/components/Safeplace/SafeplaceInteraction/SafeplaceInteraction'

const SafeplaceInsideHouse = () => {
  const isCurrentlyAvailable = useSafeplaceStore(
    (state) => state.isCurrentlyAvailable
  )
  const setCurrentPOI = useSafeplaceStore((state) => state.setCurrentPOI)

  /**
   * SET CURRENT POI ON CLICK INSIDE
   */
  const onClick = (e: PointerEvent) => {
    setCurrentPOI(SafeplacePOI.Inside)
  }

  return (
    <mesh position-y={6} onClick={onClick}>
      {isCurrentlyAvailable(SafeplacePOI.Inside) && (
        <SafeplaceInteraction safeplacePOI={SafeplacePOI.Inside} />
      )}
    </mesh>
  )
}

export default SafeplaceInsideHouse
