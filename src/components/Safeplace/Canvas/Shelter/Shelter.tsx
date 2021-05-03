import { useCallback, useEffect, useMemo } from 'react'
import * as THREE from 'three'

import SafeplacePOI from '@/constants/enums/SafeplacePOI'
import Place from '@/constants/enums/Place'
import { VoiceoverSafeplace } from '@/constants/enums/Voiceover'
import AudioStatus from '@/constants/enums/Audio'

import useAudioStore from '@/stores/useAudioStore'
import useSafeplaceStore from '@/stores/useSafeplaceStore'
import useSavePOIData from '@/hooks/POI/useSavePOIData'

import ColumnLink from '@/components/Safeplace/Canvas/ColumLocation/ColumnLink/ColumnLink'

const Shelter = ({ object }: { object: THREE.Object3D }) => {
  const isCurrentlyAvailable = useSafeplaceStore((s) =>
    s.isCurrentlyAvailable(SafeplacePOI.Inside)
  )
  const currentPOI = useSafeplaceStore((s) => s.currentPOI)
  const setCurrentPOI = useSafeplaceStore((s) => s.setCurrentPOI)
  const isCameraTravelling = useSafeplaceStore((s) => s.isCameraTravelling)
  const setCurrentVoiceover = useAudioStore((s) => s.setCurrentVoiceover)
  const isVoiceoverPlayed = useAudioStore((s) =>
    s.checkVoiceoverStatus(VoiceoverSafeplace.Inside, AudioStatus.Played)
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

  const [resources, shelterCams, shelterMesh] = useMemo(
    () => [...object.children],
    []
  )

  const [
    shelterOnBoardingCam,
    shelterResourceFocus,
    shelterResourcesCam,
    shelterInsideCam,
    shelterOutsideCam,
  ] = useMemo(
    () => [
      ...object.children.find((child) => child.children.length > 1).children,
    ],
    []
  )

  useSavePOIData(SafeplacePOI.OnBoarding, shelterOnBoardingCam.children[0])
  useSavePOIData(SafeplacePOI.Outside, shelterOutsideCam.children[0])
  useSavePOIData(SafeplacePOI.Inside, shelterInsideCam.children[0])
  useSavePOIData(SafeplacePOI.Resources, shelterResourcesCam.children[0])
  useSavePOIData(SafeplacePOI.ResourceFocused, shelterResourceFocus.children[0])

  const onLinkClick = useCallback(() => setCurrentPOI(SafeplacePOI.Inside), [])

  const shelterLinkPosition = useMemo(() => {
    const { x, z } = shelterInsideCam.position
    return new THREE.Vector3(x, -2, z)
  }, [])

  return (
    <group position={object.position}>
      <primitive object={shelterMesh}>
        <ColumnLink
          show={isCurrentlyAvailable}
          onColumnClick={onLinkClick}
          position={shelterLinkPosition}
        />
      </primitive>
    </group>
  )
}

export default Shelter
