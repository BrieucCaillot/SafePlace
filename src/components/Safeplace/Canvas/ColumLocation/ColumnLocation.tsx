import { ReactNode, useMemo } from 'react'
import * as THREE from 'three'

import SafeplacePOI from '@/constants/enums/SafeplacePOI'
import Routes from '@/constants/enums/Routes'

import useSafeplaceStore from '@/stores/useSafeplaceStore'
import useSavePOIData from '@/hooks/POI/useSavePOIData'

import ColumnLink from '@/components/Safeplace/Canvas/ColumLocation/ColumnLink/ColumnLink'
import useUserStore from '@/stores/useUserStore'
import MeshShorthand from '@/components/common/Canvas/MeshShorthand'

const ColumnLocation = ({
  safeplacePOI,
  columnObj,
  children,
}: {
  safeplacePOI: SafeplacePOI
  columnObj: THREE.Object3D
  children?: ReactNode
}) => {
  const isCurrentlyAvailable = useSafeplaceStore((s) =>
    s.isCurrentlyAvailable(safeplacePOI)
  )
  const router = useUserStore((s) => s.router)

  const isVoiceoverPlayed = useUserStore((s) => s.userData.voiceover.inside)

  const [camContainer, rock, column] = useMemo(
    () => columnObj.children as [THREE.Object3D, THREE.Mesh, THREE.Mesh],
    []
  )

  const columnLinkPosition = useMemo(
    () => new THREE.Vector3(0, 1.9, 0).add(column.position),
    [column]
  )

  const camera = useMemo(
    () =>
      camContainer.children.find(
        (o) => o.type === 'PerspectiveCamera'
      ) as THREE.PerspectiveCamera,
    [camContainer]
  )

  useSavePOIData(safeplacePOI, camera)

  return (
    <group
      position={columnObj.position}
      rotation={columnObj.rotation}
      scale={columnObj.scale}
    >
      <MeshShorthand object={column} />
      <MeshShorthand object={rock} />
      {children}
      <ColumnLink
        show={isVoiceoverPlayed && isCurrentlyAvailable}
        onColumnClick={() => router.push(Routes.MountainColumn)}
        position={columnLinkPosition}
      />
    </group>
  )
}

export default ColumnLocation
