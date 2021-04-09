import useSavePOIData from '@/hooks/POI/useSavePOIData'
import useSafeplaceStore, { SafeplacePOI } from '@/stores/useSafeplaceStore'
import { useEffect, useMemo, useRef } from 'react'
import SafeplaceInteraction from '../ColumLocation/ColumnLink/ColumnLink'

const Shelter = ({ object }: { object: THREE.Object3D }) => {
  const saveInsidePOI = useSavePOIData(SafeplacePOI.Inside)

  const shelterRef = useRef<THREE.Object3D>()

  const insidePOIObj = useMemo(
    () => (object || shelterRef.current).getObjectByName('Inside_house'),
    []
  )

  const isPOIAvailable = useSafeplaceStore((s) =>
    s.isCurrentlyAvailable(SafeplacePOI.Inside)
  )

  useEffect(() => {
    if (insidePOIObj === undefined)
      throw 'Inside POI not found, check GLTF file'
    saveInsidePOI(insidePOIObj)
  }, [])

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
