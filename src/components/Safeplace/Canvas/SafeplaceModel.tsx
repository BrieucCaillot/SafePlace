import React, { ReactElement, useEffect, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

import useUserStore from '@/stores/useUserStore'
import SafeplacePOI from '@/constants/enums/SafeplacePOI'

import Shelter from '@/components/Safeplace/Canvas/Shelter/Shelter'
import ColumnLocation from '@/components/Safeplace/Canvas/ColumLocation/ColumnLocation'
import Routes from '@/constants/enums/Routes'
import MountainColumn from '@/components/Safeplace/Canvas/ColumLocation/MountainColum'
import FlyingRocks from '@/components/common/Canvas/Decorations/FlyingRocks'
import SafeplaceGround from './SafeplaceGround'
import MeshShorthand from '@/components/common/Canvas/MeshShorthand'
import GroupShorthand from '@/components/common/Canvas/GroupShorthand'
import WaterParams from './Decorations/Water/WaterParams'
import Tree from '@/components/common/Canvas/Decorations/Trees/Tree'
import TreeParams from '@/components/common/Canvas/Decorations/Trees/TreeParams'

const SafeplaceModel = (): ReactElement => {
  const { scene } = useGLTF('/models/safeplace/safeplace.glb')

  const waterShadowTexture = useMemo(
    () =>
      new THREE.TextureLoader().load(
        '/img/safeplace/water_bake_shadow.png',
        (t) => (t.flipY = false)
      ),
    []
  )

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
  ] = useMemo(
    () =>
      [
        'backgrounds',
        'bridge_contain',
        'cairns',
        'columns',
        'ark',
        'flying_rocks',
        'ground_contain',
        'rocks',
        'shelter',
        'trees',
        'water_contain',
      ].map((n) => scene.children[0].children.find((o) => o.name === n)),
    []
  )

  const isJourneyCompleted = useUserStore((s) => s.userData.journey)

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

      <GroupShorthand object={columnGroup}>
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
      </GroupShorthand>

      <SafeplaceGround
        groundMesh={ground_contain.children[0] as THREE.Mesh}
        journeyIsComplete={isJourneyCompleted}
      />

      <GroupShorthand object={backgrounds}>
        {isJourneyCompleted ? (
          <MeshShorthand object={backgrounds.children[1] as THREE.Mesh} />
        ) : (
          <MeshShorthand object={backgrounds.children[0] as THREE.Mesh} />
        )}
      </GroupShorthand>

      {isJourneyCompleted && (
        <>
          <FlyingRocks flyingRocks={flying_rocks} />
          <GroupShorthand object={ark}>
            <MeshShorthand object={ark.children[0] as THREE.Mesh} />
          </GroupShorthand>

          <GroupShorthand object={cairns}>
            <GroupShorthand object={cairns.children[0]}>
              {cairns.children[0].children.map((child) => (
                <MeshShorthand object={child as THREE.Mesh} key={child.uuid} />
              ))}
            </GroupShorthand>
          </GroupShorthand>
        </>
      )}

      <GroupShorthand object={bridge_contain}>
        <MeshShorthand object={bridge_contain.children[0] as THREE.Mesh} />
      </GroupShorthand>
      <GroupShorthand object={trees}>
        <GroupShorthand object={trees.children[0]}>
          {trees.children[0].children.map((child) => (
            <TreeParams tree={child as THREE.Mesh} key={child.uuid} />
          ))}
        </GroupShorthand>
      </GroupShorthand>

      <GroupShorthand object={rocks}>
        <GroupShorthand object={rocks.children[0]}>
          {rocks.children[0].children.map((child) => (
            <MeshShorthand object={child as THREE.Mesh} key={child.uuid} />
          ))}
        </GroupShorthand>
      </GroupShorthand>

      <GroupShorthand object={water_contain}>
        <WaterParams
          targetMesh={water_contain.children[0] as THREE.Mesh}
          shadowTexture={waterShadowTexture}
          route={Routes.Safeplace}
        />
      </GroupShorthand>
    </>
  )
}

export default React.memo(SafeplaceModel)
