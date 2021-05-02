import AudioStatus from '@/constants/enums/Audio'
import Place from '@/constants/enums/Place'
import SafeplacePOI from '@/constants/enums/SafeplacePOI'
import { VoiceoverSafeplace } from '@/constants/enums/Voiceover'
import useAudioStore from '@/stores/useAudioStore'
import useSafeplaceStore from '@/stores/useSafeplaceStore'
import useUserStore from '@/stores/useUserStore'
import { useEffect, useMemo } from 'react'
import ColumnLink from './ColumnLink/ColumnLink'
import ColumnLocation from './ColumnLocation'
import * as THREE from 'three'

const MountainColumn = ({ columnObj }: { columnObj: THREE.Object3D }) => {
  const router = useUserStore((s) => s.router)

  const onMountainPOI = useSafeplaceStore(
    (s) => SafeplacePOI.MountainColumn === s.currentPOI
  )
  const isCameraTravelling = useSafeplaceStore((s) => s.isCameraTravelling)
  const setCurrentVoiceover = useAudioStore(
    (state) => state.setCurrentVoiceover
  )
  const isVoiceoverPlayable = useAudioStore((s) =>
    s.isVoiceoverPlayable(VoiceoverSafeplace.MountainColumn)
  )
  const isVoiceoverPlayed = useAudioStore((s) =>
    s.checkVoiceoverStatus(
      VoiceoverSafeplace.MountainColumn,
      AudioStatus.Played
    )
  )

  useEffect(() => {
    if (onMountainPOI && isVoiceoverPlayable && !isCameraTravelling)
      setCurrentVoiceover(Place.Safeplace, VoiceoverSafeplace.MountainColumn)
  }, [onMountainPOI, isCameraTravelling, isVoiceoverPlayable])

  const journeyLinkPos = useMemo(
    () =>
      new THREE.Vector3(0, 0, 0).add(
        columnObj.children.find((obj) => obj.type === 'Mesh').position
      ),
    []
  )

  return (
    <ColumnLocation
      safeplacePOI={SafeplacePOI.MountainColumn}
      columnObj={columnObj}
    >
      <ColumnLink
        onColumnClick={() => router.push('/journey')}
        show={onMountainPOI && isVoiceoverPlayed && !isCameraTravelling}
        position={new THREE.Vector3(0.1, 1.7, 0).add(journeyLinkPos)}
        size={2}
      />
    </ColumnLocation>
  )
}

export default MountainColumn
