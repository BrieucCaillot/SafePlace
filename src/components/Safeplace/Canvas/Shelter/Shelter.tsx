import { useMemo, useRef } from 'react'

import useSavePOIData from '@/hooks/POI/useSavePOIData'
import { SafeplacePOI } from '@/stores/useSafeplaceStore'
import ColumnLink from '@/components/Safeplace/Canvas/ColumLocation/ColumnLink/ColumnLink'

const Shelter = ({ object }: { object: THREE.Object3D }) => {
  const shelterRef = useRef<THREE.Object3D>()

  const shelterCams = useMemo(
    () => object.children.find((child) => child.children.length > 1).children,
    []
  )

  const [shelterRessourcesCam, shelterInsideCam, shelterOutsideCam] = useMemo(
    () => shelterCams,
    []
  )

  useSavePOIData(SafeplacePOI.OnBoarding, shelterOutsideCam)
  useSavePOIData(SafeplacePOI.Inside, shelterInsideCam)
  useSavePOIData(SafeplacePOI.Resources, shelterRessourcesCam)

  return (
    <primitive ref={shelterRef} object={object}>
      <ColumnLink
        position={shelterInsideCam.position.toArray()}
        safeplacePOI={SafeplacePOI.Inside}
      />
    </primitive>
  )
}

export default Shelter
