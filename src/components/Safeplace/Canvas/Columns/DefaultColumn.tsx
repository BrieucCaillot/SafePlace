import { ReactNode, useMemo } from 'react'
import * as THREE from 'three'

import SafeplacePOI from '@/constants/enums/SafeplacePOI'

import useSafeplaceStore from '@/stores/useSafeplaceStore'
import useSavePOIData from '@/hooks/POI/useSavePOIData'

import ColumnLink from '@/components/Safeplace/Canvas/Columns/ColumnLink/ColumnLink'
import MeshShorthand from '@/components/common/Canvas/MeshShorthand'
import ColumnRock from '@/components/Safeplace/Canvas/Columns/ColumnRock'
import useSceneStore from '@/stores/useSceneStore'
import SceneName from '@/constants/enums/SceneName'

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
  const isAvailable = useSafeplaceStore(
    (s) => !s.isCameraTravelling && s.isCurrentlyAvailable(safeplacePOI)
  )

  const onSafeplace = useSceneStore(
    (s) => s.renderedScene === SceneName.Safeplace
  )

  const [btn, camContainer, rock, column] = useMemo(
    () =>
      columnObj.children as [
        THREE.Mesh,
        THREE.Object3D,
        THREE.Mesh,
        THREE.Mesh
      ],
    []
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
        show={(isColumnAvailable ?? isAvailable) && onSafeplace}
        onColumnClick={onColumnClick}
        position={btn.position}
      />
    </group>
  )
}

export default DefaultColumn
