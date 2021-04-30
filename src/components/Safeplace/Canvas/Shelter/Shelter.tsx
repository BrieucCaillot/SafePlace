import { useEffect, useMemo } from 'react'
import * as THREE from 'three'

import SafeplacePOI from '@/constants/enums/SafeplacePOI'
import Place from '@/constants/enums/Place'
import { VoiceoverSafeplace } from '@/constants/enums/Voiceover'

import useAudioStore from '@/stores/useAudioStore'
import useSafeplaceStore from '@/stores/useSafeplaceStore'
import useSavePOIData from '@/hooks/POI/useSavePOIData'

import ColumnLink from '@/components/Safeplace/Canvas/ColumLocation/ColumnLink/ColumnLink'

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

  const shelterLinkPosition = useMemo(() => {
    const { x, z } = shelterInsideCam.position
    return new THREE.Vector3(x, -2, z)
  }, [])

  return (
    <primitive object={object}>
      <ColumnLink
        position={shelterLinkPosition}
        show={isCurrentlyAvailable}
        safeplacePOI={SafeplacePOI.Inside}
      />
    </primitive>
  )
}

export default Shelter
