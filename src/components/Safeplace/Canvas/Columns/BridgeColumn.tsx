import { useMemo } from 'react'
import * as THREE from 'three'

import useUserStore from '@/stores/useUserStore'
import useSafeplaceStore from '@/stores/useSafeplaceStore'
import SafeplacePOI from '@/constants/enums/SafeplacePOI'
import Routes from '@/constants/enums/Routes'

import ColumnLink from '@/components/Safeplace/Canvas/Columns/ColumnLink/ColumnLink'
import DefaultColumn from '@/components/Safeplace/Canvas/Columns/DefaultColumn'

const BridgeColumn = ({ columnObj }: { columnObj: THREE.Object3D }) => {
  const router = useUserStore((s) => s.router)

  const isCurrentlyAvailable = useSafeplaceStore((s) =>
    s.isCurrentlyAvailable(SafeplacePOI.BridgeColumn)
  )

  const isCameraTravelling = useSafeplaceStore((s) => s.isCameraTravelling)
  const isJourneyCompleted = useUserStore((s) => s.userData.journey)

  const journeyLinkPos = useMemo(() => new THREE.Vector3(0, 1, 0), [])

  return (
    <DefaultColumn
      safeplacePOI={SafeplacePOI.BridgeColumn}
      columnObj={columnObj}
      onColumnClick={() => router.push(Routes.BridgeColumn)}
      isColumnAvailable={
        !isCameraTravelling && isJourneyCompleted && isCurrentlyAvailable
      }
    >
      <ColumnLink
        onColumnClick={() => console.log('CLICKED BRDIGE COLUMN LINK')}
        show={false}
        // show={isJourneyCompleted && onBridgePOI && !isCameraTravelling}
        size={5}
        position={journeyLinkPos}
      />
    </DefaultColumn>
  )
}

export default BridgeColumn
