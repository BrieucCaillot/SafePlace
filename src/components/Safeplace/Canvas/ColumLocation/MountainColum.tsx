import { useEffect, useMemo } from 'react'
import * as THREE from 'three'

import AudioStatus from '@/constants/enums/Audio'
import Routes from '@/constants/enums/Routes'
import Place from '@/constants/enums/Place'
import SafeplacePOI from '@/constants/enums/SafeplacePOI'
import { VoiceoverSafeplace } from '@/constants/enums/Voiceover'
import useAudioStore from '@/stores/useAudioStore'
import useSafeplaceStore from '@/stores/useSafeplaceStore'
import useUserStore from '@/stores/useUserStore'
import ColumnLink from './ColumnLink/ColumnLink'
import ColumnLocation from './ColumnLocation'

const MountainColumn = ({ columnObj }: { columnObj: THREE.Object3D }) => {
  const router = useUserStore((s) => s.router)

  const onMountainPOI = useSafeplaceStore(
    (s) => SafeplacePOI.MountainColumn === s.currentPOI
  )
  const isCameraTravelling = useSafeplaceStore((s) => s.isCameraTravelling)

  const isVoiceoverPlayed = useUserStore(
    (s) => s.userData.voiceover.mountainColumn
  )

  const journeyLinkPos = useMemo(() => new THREE.Vector3(0, 1, 0), [])

  return (
    <ColumnLocation
      safeplacePOI={SafeplacePOI.MountainColumn}
      columnObj={columnObj}
    >
      <ColumnLink
        onColumnClick={() => router.push(Routes.Journey)}
        show={onMountainPOI && isVoiceoverPlayed && !isCameraTravelling}
        size={5}
        position={journeyLinkPos}
      />
    </ColumnLocation>
  )
}

export default MountainColumn
