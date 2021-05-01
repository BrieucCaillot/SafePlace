import { useCallback, useEffect, useMemo } from 'react'
import * as THREE from 'three'

import SafeplacePOI from '@/constants/enums/SafeplacePOI'
import Place from '@/constants/enums/Place'
import AudioStatus from '@/constants/enums/Audio'
import { VoiceoverSafeplace } from '@/constants/enums/Voiceover'

import useSafeplaceStore from '@/stores/useSafeplaceStore'
import useAudioStore from '@/stores/useAudioStore'
import useSavePOIData from '@/hooks/POI/useSavePOIData'

import ColumnLink from '@/components/Safeplace/Canvas/ColumLocation/ColumnLink/ColumnLink'
import useUserStore from '@/stores/useUserStore'

const ColumnLocation = ({
  safeplacePOI,
  columnObj,
}: {
  safeplacePOI: SafeplacePOI
  columnObj: THREE.Object3D
}) => {
  const router = useUserStore((s) => s.router)

  const isMountainColumn = useMemo(
    () => safeplacePOI == SafeplacePOI.MountainColumn,
    []
  )
  const isCurrentlyAvailable = useSafeplaceStore((s) =>
    s.isCurrentlyAvailable(safeplacePOI)
  )
  const isMountainColumnCurrentPOI = useSafeplaceStore(
    (s) => SafeplacePOI.MountainColumn === s.currentPOI
  )
  const setCurrentPOI = useSafeplaceStore((s) => s.setCurrentPOI)

  const isCameraTravelling = useSafeplaceStore((s) => s.isCameraTravelling)
  const setCurrentVoiceover = useAudioStore((s) => s.setCurrentVoiceover)
  const isVoiceoverPlayable = useAudioStore((s) =>
    s.isVoiceoverPlayable(VoiceoverSafeplace.MountainColumn)
  )
  const isVoiceoverPlayed = useAudioStore((s) =>
    s.checkVoiceoverStatus(
      VoiceoverSafeplace.MountainColumn,
      AudioStatus.Played
    )
  )
  const isVoiceoverInsidePlayed = useAudioStore((s) =>
    s.checkVoiceoverStatus(VoiceoverSafeplace.Inside, AudioStatus.Played)
  )

  useEffect(() => {
    if (
      !isMountainColumnCurrentPOI ||
      !isMountainColumn ||
      !isVoiceoverPlayable ||
      isCameraTravelling
    )
      return
    setCurrentVoiceover(Place.Safeplace, VoiceoverSafeplace.MountainColumn)
  }, [isMountainColumnCurrentPOI, isCameraTravelling])

  const isReadyToJourney = useMemo(
    () => isMountainColumn && isMountainColumnCurrentPOI && isVoiceoverPlayed,
    [isVoiceoverPlayed]
  )

  const showColumnLink = useMemo(
    () => (isVoiceoverInsidePlayed && isCurrentlyAvailable) || isReadyToJourney,
    [isVoiceoverInsidePlayed, isCurrentlyAvailable, isReadyToJourney]
  )

  const onClick = useCallback(() => {
    // TODO : WHY PUSH OF NULL
    isReadyToJourney ? router.push('/journey') : setCurrentPOI(safeplacePOI)
  }, [isReadyToJourney])

  const collider = useMemo(
    () => columnObj.children.find((obj) => obj.type === 'Mesh') as THREE.Mesh,
    []
  )

  const columnLinkPosition = useMemo(() => {
    const { x, z } = collider.position
    return new THREE.Vector3(x, 1.9, z)
  }, [collider])

  const camera = useMemo(
    () =>
      columnObj.children
        .find((o) => o.type === 'Object3D')
        ?.children.find(
          (o) => o.type === 'PerspectiveCamera'
        ) as THREE.PerspectiveCamera,
    []
  )

  useSavePOIData(safeplacePOI, camera)

  return (
    <group
      position={columnObj.position}
      rotation={columnObj.rotation}
      scale={columnObj.scale}
    >
      <mesh
        geometry={collider.geometry}
        material={collider.material}
        visible={false}
        onClick={() => console.log(safeplacePOI)}
      />

      <ColumnLink
        safeplacePOI={safeplacePOI}
        show={showColumnLink}
        onColumnClick={onClick}
        position={columnLinkPosition}
      />
    </group>
  )
}

export default ColumnLocation
