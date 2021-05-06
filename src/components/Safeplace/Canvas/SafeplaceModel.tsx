import React, { ReactElement, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

import useUserStore from '@/stores/useUserStore'
import SafeplacePOI from '@/constants/enums/SafeplacePOI'

import Shelter from '@/components/Safeplace/Canvas/Shelter/Shelter'
import ColumnLocation from '@/components/Safeplace/Canvas/ColumLocation/ColumnLocation'
import MountainColumn from '@/components/Safeplace/Canvas/ColumLocation/MountainColum'
import CustomSky from '@/components/canvas/Sky/CustomSky'
import SafeplaceFlyingRocks from '@/components/Safeplace/Canvas/Decorations/SafeplaceFlyingRocks'
import GrassParams from './Decorations/Grass/GrassParams'
import Grass from './Decorations/Grass/Grass'
import SafeplaceGround from './SafeplaceGround'

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

  const isJourneyCompleted = useUserStore((s) => s.isJourneyCompleted)

  const columnAssoc: { [name: string]: SafeplacePOI } = {
    column_1_group: SafeplacePOI.MountainColumn,
    column_2_group: SafeplacePOI.PlaceholderColumn1,
    column_3_group: SafeplacePOI.PlaceholderColumn2,
    column_4_group: SafeplacePOI.PlaceholderColumn3,
    column_5_group: SafeplacePOI.PlaceholderColumn4,
  }

  const columnChildren = useMemo(() => [...columnGroup.children], [])

  return (
    <>
      <Shelter object={shelter} />

      <group position={columnGroup.position}>
        {columnChildren.map((col) =>
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
      </group>

      <primitive object={backgrounds} />
      <primitive object={bridge_contain} />
      <primitive object={cairns} />
      <primitive object={ark} />
      <primitive object={trees} />
      {isJourneyCompleted && (
        <SafeplaceFlyingRocks flyingRocks={flying_rocks} />
      )}
      <primitive object={rocks} />
      <primitive object={water_contain} />
      <CustomSky />
      <SafeplaceGround groundMesh={ground_contain.children[0] as THREE.Mesh} />
    </>
  )
}

export default React.memo(SafeplaceModel)
