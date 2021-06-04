import { ReactNode, useMemo } from 'react'
import * as THREE from 'three'

import SafeplacePOI from '@/constants/enums/SafeplacePOI'
import Routes from '@/constants/enums/Routes'

import useSafeplaceStore from '@/stores/useSafeplaceStore'
import useUserStore from '@/stores/useUserStore'
import useSavePOIData from '@/hooks/POI/useSavePOIData'

import ColumnLink from '@/components/Safeplace/Canvas/Columns/ColumnLink/ColumnLink'
import MeshShorthand from '@/components/common/Canvas/MeshShorthand'
import ColumnRock from '@/components/Safeplace/Canvas/Columns/ColumnRock'

const DefaultColumn = ({
  safeplacePOI,
  columnObj,
  children,
  onColumnClick,
  isColumnAvailable = null,
}: {
  safeplacePOI: SafeplacePOI
  columnObj: THREE.Object3D
  children?: ReactNode
  onColumnClick: Function
  isColumnAvailable?: boolean
}) => {
  const router = useUserStore((s) => s.router)

  const isCurrentlyAvailable = useSafeplaceStore((s) =>
    s.isCurrentlyAvailable(safeplacePOI)
  )
  const isCameraTravelling = useSafeplaceStore((s) => s.isCameraTravelling)

  const isAvailable = useMemo(
    () => !isCameraTravelling && isCurrentlyAvailable,
    [isCameraTravelling, isCurrentlyAvailable]
  )

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
      <ColumnRock rock={rock} canRotate={isAvailable} />
      {children}
      <ColumnLink
        show={
          isColumnAvailable ?? (!isCameraTravelling && isCurrentlyAvailable)
        }
        onColumnClick={onColumnClick}
        position={columnLinkPosition}
      />
    </group>
  )
}

export default DefaultColumn
