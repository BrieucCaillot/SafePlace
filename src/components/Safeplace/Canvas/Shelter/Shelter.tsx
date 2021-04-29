import { useEffect, useMemo, useRef, useState } from 'react'

import useSavePOIData from '@/hooks/POI/useSavePOIData'
import useSafeplaceStore from '@/stores/useSafeplaceStore'
import SafeplacePOI from '@/constants/enums/SafeplacePOI'
import Place from '@/constants/enums/Place'
import ColumnLink from '@/components/Safeplace/Canvas/ColumLocation/ColumnLink/ColumnLink'
import useAudioStore, { VoiceoverSafeplace } from '@/stores/useAudioStore'

const Shelter = ({ object }: { object: THREE.Object3D }) => {
  const isCurrentlyAvailable = useSafeplaceStore((state) =>
    state.isCurrentlyAvailable(SafeplacePOI.Inside)
  )
  const currentPOI = useSafeplaceStore((state) => state.currentPOI)
  const isCameraTravelling = useSafeplaceStore(
    (state) => state.isCameraTravelling
  )

  const setCurrentVoiceover = useAudioStore(
    (state) => state.setCurrentVoiceover
  )
  const isVoiceoverPlayed = useAudioStore((state) =>
    state.isVoiceoverPlayed(VoiceoverSafeplace.Inside)
  )

  useEffect(() => {
    if (
      isVoiceoverPlayed ||
      currentPOI != SafeplacePOI.Inside ||
      isCameraTravelling
    )
      return
    setCurrentVoiceover(Place.Safeplace, VoiceoverSafeplace.Inside)
  }, [isVoiceoverPlayed, currentPOI, isCameraTravelling])

  const shelterRef = useRef<THREE.Object3D>()

  const shelterCams = useMemo(
    () => object.children.find((child) => child.children.length > 1).children,
    []
  )

  const [
    shelterResourceFocus,
    shelterResourcesCam,
    shelterInsideCam,
    shelterOutsideCam,
  ] = useMemo(() => shelterCams, [])

  useSavePOIData(SafeplacePOI.OnBoarding, shelterOutsideCam.children[0])
  useSavePOIData(SafeplacePOI.Outside, shelterOutsideCam.children[0])
  useSavePOIData(SafeplacePOI.Inside, shelterInsideCam.children[0])
  useSavePOIData(SafeplacePOI.Resources, shelterResourcesCam.children[0])
  useSavePOIData(SafeplacePOI.ResourceFocused, shelterResourceFocus.children[0])

  return (
    <primitive ref={shelterRef} object={object}>
      <ColumnLink
        position={shelterInsideCam.position.toArray()}
        show={isCurrentlyAvailable}
        safeplacePOI={SafeplacePOI.Inside}
      />
    </primitive>
  )
}

export default Shelter
