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
  const column = useMemo(() => columnObj.children[2] as THREE.Mesh, [])
  const column_rock = useMemo(() => columnObj.children[1] as THREE.Mesh, [])

  const camera = useMemo(
    () => columnObj.children[0] as THREE.PerspectiveCamera,
    []
  )

  useSavePOIData(safeplacePOI, camera)

  return (
    <group
      position={columnObj.position}
      rotation={columnObj.rotation}
      scale={columnObj.scale}
    >
      <ColumnLink safeplacePOI={safeplacePOI} position={column.position} />
      <mesh
        name={column_rock.name}
        position={column_rock.position}
        scale={column_rock.scale}
        material={column_rock.material}
        geometry={column_rock.geometry}
      />
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
