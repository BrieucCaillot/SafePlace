/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

type GLTFResult = GLTF & {
  nodes: {
    Cube: THREE.Mesh
    Cube001: THREE.Mesh
    Cube002: THREE.Mesh
    Cube003: THREE.Mesh
    Cube004: THREE.Mesh
    Floor: THREE.Mesh
    Pillard_1: THREE.Mesh
    Pillard_2: THREE.Mesh
    Pillard_3: THREE.Mesh
    Pillard_4: THREE.Mesh
    Roof: THREE.Mesh
  }
  materials: {}
}

export default function SafeplaceModel(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF('/models/safeplace.glb') as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh
        material={nodes.Cube.material}
        geometry={nodes.Cube.geometry}
        position={nodes.Cube.position}
        scale={nodes.Cube.scale}
      />
      <mesh
        material={nodes.Cube001.material}
        geometry={nodes.Cube001.geometry}
        scale={nodes.Cube001.scale}
        position={nodes.Cube001.position}
      />
      <mesh
        material={nodes.Cube002.material}
        geometry={nodes.Cube002.geometry}
        scale={nodes.Cube002.scale}
        position={nodes.Cube002.position}
      />
      <mesh
        material={nodes.Cube003.material}
        geometry={nodes.Cube003.geometry}
        scale={nodes.Cube003.scale}
        position={nodes.Cube003.position}
      />
      <mesh
        material={nodes.Cube004.material}
        geometry={nodes.Cube004.geometry}
        scale={nodes.Cube004.scale}
        position={nodes.Cube004.position}
      />
      <mesh
        material={nodes.Floor.material}
        geometry={nodes.Floor.geometry}
        position={nodes.Floor.position}
        scale={nodes.Floor.scale}
      />
      <mesh
        material={nodes.Pillard_1.material}
        geometry={nodes.Pillard_1.geometry}
        position={nodes.Pillard_1.position}
        scale={nodes.Pillard_1.scale}
      />
      <mesh
        material={nodes.Pillard_2.material}
        geometry={nodes.Pillard_2.geometry}
        scale={nodes.Pillard_2.scale}
        position={nodes.Pillard_2.position}
      />
      <mesh
        material={nodes.Pillard_3.material}
        geometry={nodes.Pillard_3.geometry}
        scale={nodes.Pillard_3.scale}
        position={nodes.Pillard_3.position}
      />
      <mesh
        material={nodes.Pillard_4.material}
        geometry={nodes.Pillard_4.geometry}
        scale={nodes.Pillard_4.scale}
        position={nodes.Pillard_4.position}
      />
      <mesh
        material={nodes.Roof.material}
        geometry={nodes.Roof.geometry}
        position={nodes.Roof.position}
        scale={nodes.Roof.scale}
      />
    </group>
  )
}

useGLTF.preload('/models/safeplace.glb')