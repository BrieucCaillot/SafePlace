/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useMemo, useRef } from 'react'
import { GroupProps } from 'react-three-fiber'
import { useGLTF } from '@react-three/drei'
import { SafeplacePOI } from '@/stores/useSafeplaceStore'

import SafeplacePedestal from '@/components/Safeplace/SafePlacePedestal/SafeplacePedestal'
import SafeplaceBridge from '@/components/Safeplace/SafeplaceBridge/SafeplaceBridge'
import SafeplaceAbout from '@/components/Safeplace/SafeplaceAbout/SafeplaceAbout'

const pedestalsAssoc = {
  POI_1: SafeplacePOI.MountainPedestal,
  POI_2: SafeplacePOI.PlaceholderPedetral1,
  POI_3: SafeplacePOI.PlaceholderPedetral2,
  POI_4: SafeplacePOI.PlaceholderPedetral3,
  POI_5: SafeplacePOI.PlaceholderPedetral4,
}

export default function SafeplaceTest(props: GroupProps) {
  const group = useRef<THREE.Group>(null)
  const { scene } = useGLTF('/models/safeplace.glb')

  const bridge = useMemo<THREE.Object3D[]>(() => scene.children[2].children, [
    scene,
  ])
  const pedestals = useMemo<THREE.Object3D[]>(
    () => scene.children[0].children,
    [scene]
  )
  const houseElems = useMemo<THREE.Object3D[]>(
    () => scene.children[1].children,
    [scene]
  )

  return (
    <group ref={group} {...props} dispose={null}>
      <SafeplaceBridge safeplacePOI={SafeplacePOI.Bridge} bridge={bridge} />
      <group>
        {pedestals.map((poi, index) => (
          <SafeplacePedestal
            key={index}
            safeplacePOI={pedestalsAssoc[poi.name]}
            pedestalObj={poi}
          />
        ))}
      </group>
      <group>
        {houseElems.map((houseElem: THREE.Mesh, index) => (
          <mesh
            key={index}
            position={houseElem.position}
            scale={houseElem.scale}
            material={houseElem.material}
            geometry={houseElem.geometry}
          />
        ))}
      </group>
    </group>
  )
}
