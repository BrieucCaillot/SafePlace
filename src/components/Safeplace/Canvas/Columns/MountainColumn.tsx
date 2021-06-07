import { useMemo } from 'react'
import * as THREE from 'three'

import useSafeplaceStore from '@/stores/useSafeplaceStore'
import useUserStore from '@/stores/useUserStore'
import Routes from '@/constants/enums/Routes'
import SafeplacePOI from '@/constants/enums/SafeplacePOI'

import ColumnLink from '@/components/Safeplace/Canvas/Columns/ColumnLink/ColumnLink'
import DefaultColumn from '@/components/Safeplace/Canvas/Columns/DefaultColumn'

const MountainColumn = ({ columnObj }: { columnObj: THREE.Object3D }) => {
  const router = useUserStore((s) => s.router)

  const isCurrentlyAvailable = useSafeplaceStore((s) =>
    s.isCurrentlyAvailable(SafeplacePOI.MountainColumn)
  )

  const onMountainPOI = useSafeplaceStore(
    (s) => SafeplacePOI.MountainColumn === s.currentPOI
  )
  const isCameraTravelling = useSafeplaceStore((s) => s.isCameraTravelling)

  const isVoiceoverPlayed = useUserStore(
    (s) => s.userData.voiceover.mountainColumn
  )

  const journeyLinkPos = useMemo(() => new THREE.Vector3(0, 1, 0), [])

  return (
    <DefaultColumn
      safeplacePOI={SafeplacePOI.MountainColumn}
      columnObj={columnObj}
      onColumnClick={() => router.push(Routes.MountainColumn)}
      isColumnAvailable={
        !isCameraTravelling && isVoiceoverPlayed && isCurrentlyAvailable
      }
    >
      <ColumnLink
        onColumnClick={() => router.push(Routes.Journey)}
        show={onMountainPOI && isVoiceoverPlayed && !isCameraTravelling}
        size={5}
        position={journeyLinkPos}
      />
    </DefaultColumn>
  )
}

export default MountainColumn