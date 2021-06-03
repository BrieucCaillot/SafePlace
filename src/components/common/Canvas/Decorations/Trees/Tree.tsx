import { MeshProps, useFrame } from 'react-three-fiber'
import * as THREE from 'three'
import { useMemo, useRef } from 'react'
import { folder, useControls } from 'leva'

import useNumberUniform from '@/hooks/uniforms/useNumberUniform'

import vertexShader from '@/components/common/Canvas/Decorations/Trees/Tree.vs'
import fragmentShader from '@/components/common/Canvas/Decorations/Trees/Tree.fs'

type TreeParams = {
  uWindNoiseSize: number
  uWindSpeed: number
  uWindAmplitude: number
}

const Tree = ({
  treeParams,
  tree,
  ...props
}: MeshProps & { treeParams: TreeParams; tree: THREE.Mesh }) => {
  const clockRef = useRef<THREE.Clock>(new THREE.Clock(true))

  const uniforms = useRef<Record<string, THREE.IUniform>>({
    uTexture: { value: (tree.material as THREE.MeshBasicMaterial).map },
    uTime: { value: 0 },
    uWindNoiseSize: { value: 0 },
    uWindSpeed: { value: 0 },
    uWindAmplitude: { value: 0 },
  })

  useNumberUniform(
    uniforms.current.uWindNoiseSize,
    treeParams.uWindNoiseSize / 10
  )
  useNumberUniform(uniforms.current.uWindSpeed, treeParams.uWindSpeed / 10)
  useNumberUniform(
    uniforms.current.uWindAmplitude,
    treeParams.uWindAmplitude / 10
  )

  useFrame(() => {
    uniforms.current.uTime.value = clockRef.current.getElapsedTime()
  })

  return (
    <mesh
      geometry={tree.geometry}
      position={tree.position}
      scale={tree.scale}
      rotation={tree.rotation}
      {...props}
    >
      <shaderMaterial
        uniforms={uniforms.current}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent={true}
        vertexColors={true}
        alphaTest={0.5}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

export default Tree
