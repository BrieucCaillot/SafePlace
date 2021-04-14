import { useEffect, useMemo } from 'react'

import useSafeplaceStore, { SafeplacePOI } from '@/stores/useSafeplaceStore'
import useSavePOIData from '@/hooks/POI/useSavePOIData'
import ColumnLink from '@/components/Safeplace/Canvas/ColumLocation/ColumnLink/ColumnLink'

const ColumnLocation = ({
  safeplacePOI,
  columnObj,
  onClick = () => {},
}: {
  safeplacePOI: SafeplacePOI
  columnObj: THREE.Object3D
  onClick?: () => void
}) => {
  const isCurrentlyAvailable = useSafeplaceStore((state) =>
    state.isCurrentlyAvailable(safeplacePOI)
  )

  const column = useMemo(
    () => columnObj.children.find((o) => o.type === 'Mesh') as THREE.Mesh,
    []
  )

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
      {isCurrentlyAvailable && (
        <ColumnLink safeplacePOI={safeplacePOI} position={column.position} />
      )}
      <mesh
        name={column.name}
        position={column.position}
        scale={column.scale}
        material={column.material}
        geometry={column.geometry}
        onClick={onClick}
      />
    </group>
  )
}

export default ColumnLocation
