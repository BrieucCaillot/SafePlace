import useSavePOIData from '@/hooks/POI/useSavePOIData'
import useSafeplaceStore, { SafeplacePOI } from '@/stores/useSafeplaceStore'
import { useEffect, useMemo, useRef } from 'react'
import SafeplaceInteraction from '../ColumLocation/ColumnLink/ColumnLink'

const Shelter = ({ object }: { object: THREE.Object3D }) => {
  const shelterRef = useRef<THREE.Object3D>()

  const [shelterRessourcesCam, shelterInsideCam, shelterOutsideCam] = useMemo(
    () => object.children,
    []
  )

  const insidePOIObj = useMemo(() => shelterInsideCam.children[0], [])

  useSavePOIData(SafeplacePOI.OnBoarding, shelterOutsideCam.children[0])
  useSavePOIData(SafeplacePOI.Inside, insidePOIObj)
  useSavePOIData(SafeplacePOI.Resources, shelterRessourcesCam.children[0])

  const isPOIAvailable = useSafeplaceStore((s) =>
    s.isCurrentlyAvailable(SafeplacePOI.Inside)
  )

  return (
    <primitive ref={shelterRef} object={object}>
      {isPOIAvailable && (
        <SafeplaceInteraction
          position={insidePOIObj?.position.toArray()}
          safeplacePOI={SafeplacePOI.Inside}
        />
      )}
    </primitive>
  )
}

export default Shelter
