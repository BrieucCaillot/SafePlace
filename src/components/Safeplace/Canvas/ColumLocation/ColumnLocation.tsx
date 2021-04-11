import { useMemo } from 'react'

import useSafeplaceStore, { SafeplacePOI } from '@/stores/useSafeplaceStore'
import useSavePOIData from '@/hooks/POI/useSavePOIData'
import ColumnLink from '@/components/Safeplace/Canvas/ColumLocation/ColumnLink/ColumnLink'

const ColumnLocation = ({
  safeplacePOI,
  columnObj,
}: {
  safeplacePOI: SafeplacePOI
  columnObj: THREE.Object3D
}) => {
  const isCurrentlyAvailable = useSafeplaceStore((state) =>
    state.isCurrentlyAvailable(safeplacePOI)
  )

  const camera = useMemo(() => columnObj.children[0], [])
  const column = useMemo(() => columnObj.children[1] as THREE.Mesh, [])

  const savePOI = useSavePOIData(safeplacePOI)

  const onPedestalClick = () => {
    if (safeplacePOI !== SafeplacePOI.MountainPedestal) return
  }

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
        ref={savePOI}
        name={camera.name}
        position={camera.position}
        rotation={columnObj.rotation}
      />
      <mesh
        name={column.name}
        position={column.position}
        scale={column.scale}
        material={column.material}
        geometry={column.geometry}
        onClick={onPedestalClick}
      />
    </group>
  )
}

export default ColumnLocation
