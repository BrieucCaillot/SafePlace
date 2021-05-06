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

  const ground = useMemo(() => {
    const mesh = ground_contain.children[0] as THREE.Mesh

    const uvAttr = mesh.geometry.getAttribute('uv')
    const colorAttr = mesh.geometry.getAttribute('color')
    const vertexCount = uvAttr.count

    const flowerWeight1 = new Float32Array(vertexCount)
    const grassWeight = new Float32Array(vertexCount)
    const flowerWeight2 = new Float32Array(vertexCount)
    const fakeColor = new Float32Array(vertexCount * 3)

    for (let index = 0; index < vertexCount; index++) {
      fakeColor[index * 3 + 0] = uvAttr.array[index * uvAttr.itemSize + 0]
      fakeColor[index * 3 + 1] = uvAttr.array[index * uvAttr.itemSize + 1]
      fakeColor[index * 3 + 2] = 0
      flowerWeight1[index] = colorAttr.array[index * colorAttr.itemSize + 0]
      grassWeight[index] = colorAttr.array[index * colorAttr.itemSize + 1]
      flowerWeight2[index] = colorAttr.array[index * colorAttr.itemSize + 2]
    }
    mesh.geometry.setAttribute(
      'flowerWeight1',
      new THREE.BufferAttribute(flowerWeight1, 1)
    )
    mesh.geometry.setAttribute(
      'grassWeight',
      new THREE.BufferAttribute(grassWeight, 1)
    )
    mesh.geometry.setAttribute(
      'flowerWeight3',
      new THREE.BufferAttribute(flowerWeight2, 1)
    )
    mesh.geometry.setAttribute('color', new THREE.BufferAttribute(fakeColor, 3))
    ;(mesh.material as THREE.MeshBasicMaterial).vertexColors = false
    return mesh
  }, [])

  const columnChildren = useMemo(() => [...columnGroup.children], [])

  const shadowTexture = useMemo(() => {
    const t = new THREE.TextureLoader().load(
      '/img/safeplace/shadow_safeplace.png'
    )
    t.flipY = false
    return t
  }, [])

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
      <GrassParams shadowTexture={shadowTexture}>
        {(ref) => <primitive object={ground} ref={ref} />}
      </GrassParams>
      <CustomSky />
    </>
  )
}

export default React.memo(SafeplaceModel)
