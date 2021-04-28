import { useEffect, useMemo, useRef } from 'react'

import useSavePOIData from '@/hooks/POI/useSavePOIData'
import useSafeplaceStore, { SafeplacePOI } from '@/stores/useSafeplaceStore'
import ColumnLink from '@/components/Safeplace/Canvas/ColumLocation/ColumnLink/ColumnLink'
import useAudioStore, { VoiceoverSafeplace } from '@/stores/useAudioStore'
import { Place } from '@/stores/useSceneStore'

const Shelter = ({ object }: { object: THREE.Object3D }) => {
  const currentPOI = useSafeplaceStore((state) => state.currentPOI)
  const isCameraTravelling = useSafeplaceStore(
    (state) => state.isCameraTravelling
  )
  const setCurrentVoiceover = useAudioStore(
    (state) => state.setCurrentVoiceover
  )

  useEffect(() => {
    if (currentPOI != SafeplacePOI.Inside || isCameraTravelling) return
    setCurrentVoiceover(Place.Safeplace, VoiceoverSafeplace.Inside)
  }, [currentPOI, isCameraTravelling])

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
  useSavePOIData(SafeplacePOI.Outside, shelterOutsideCam)
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
