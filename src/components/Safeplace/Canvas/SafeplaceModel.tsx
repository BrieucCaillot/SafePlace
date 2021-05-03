import React, { ReactElement, ReactNode, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'

import Shelter from '@/components/Safeplace/Canvas/Shelter/Shelter'
import ColumnLocation from '@/components/Safeplace/Canvas/ColumLocation/ColumnLocation'
import Grass from '@/components/Safeplace/Canvas/Decorations/Grass/Grass'
import SafeplacePOI from '@/constants/enums/SafeplacePOI'
import MountainColumn from './ColumLocation/MountainColum'
import CustomSky from '@/components/canvas/Sky/CustomSky'

const SafeplaceModel = (): ReactElement => {
  const { scene } = useGLTF('/models/safeplace/safeplace.glb')
  const [
    backgrounds,
    bridge_contain,
    cairns,
    columnGroup,
    ark,
    flying_rocks,
    ground_contain,
    rocks,
    shelter,
    trees,
    water_contain,
  ] = useMemo(() => [...scene.children[0].children], [])

  const columnAssoc: { [name: string]: SafeplacePOI } = {
    column_1_group: SafeplacePOI.MountainColumn,
    column_2_group: SafeplacePOI.PlaceholderColumn1,
    column_3_group: SafeplacePOI.PlaceholderColumn2,
    column_4_group: SafeplacePOI.PlaceholderColumn3,
    column_5_group: SafeplacePOI.PlaceholderColumn4,
  }

  const ground = useMemo(() => ground_contain.children[0], [])

  const columnChildren = useMemo(() => [...columnGroup.children.reverse()], [])
  const [columnMesh, ...columns] = columnChildren

  return (
    <>
      <Shelter object={shelter} />

      <group position={columnGroup.position}>
        {columns.map((col) =>
          columnAssoc[col.name] === SafeplacePOI.MountainColumn ? (
            <MountainColumn columnObj={col} key={col.name} />
          ) : (
            <ColumnLocation
              safeplacePOI={columnAssoc[col.name]}
              columnObj={col}
              key={col.name}
            />
          )
        )}
        <primitive object={columnMesh} />
      </group>

      <primitive object={backgrounds} />
      <primitive object={bridge_contain} />
      <primitive object={cairns} />
      <primitive object={trees} />
      <primitive object={ark} />
      {/* <primitive object={flying_rocks} /> */}
      <primitive object={rocks} />
      <primitive object={water_contain} />
      <Grass>{(ref) => <primitive object={ground} ref={ref} />}</Grass>
      <CustomSky />
    </>
  )
}

export default React.memo(SafeplaceModel)
