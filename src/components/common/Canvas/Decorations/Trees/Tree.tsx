import { MeshProps, useFrame } from 'react-three-fiber'
import * as THREE from 'three'
import { useRef } from 'react'

import useNumberUniform from '@/hooks/uniforms/useNumberUniform'

import vertexShader from '@/components/common/Canvas/Decorations/Trees/Tree.vs'
import fragmentShader from '@/components/common/Canvas/Decorations/Trees/Tree.fs'
import MeshShorthand from '../../MeshShorthand'

type TreeParams = {
  uWindNoiseSize: number
  uWindSpeed: number
  uWindAmplitude: number
}

const Tree = ({
  treeParams: { uWindNoiseSize, uWindSpeed, uWindAmplitude },
  tree,
  ...props
}: Omit<MeshProps, 'ref'> & { treeParams: TreeParams; tree: THREE.Mesh }) => {
  const clockRef = useRef<THREE.Clock>(new THREE.Clock(true))

  const uniforms = useRef<Record<string, THREE.IUniform>>({
    ...THREE.UniformsLib['fog'],
    uTexture: { value: (tree.material as THREE.MeshBasicMaterial).map },
    uTime: { value: 0 },
    uWindNoiseSize: { value: 0 },
    uWindSpeed: { value: 0 },
    uWindAmplitude: { value: 0 },
  })

  useNumberUniform(uniforms.current.uWindNoiseSize, uWindNoiseSize / 10)
  useNumberUniform(uniforms.current.uWindSpeed, uWindSpeed / 10)
  useNumberUniform(uniforms.current.uWindAmplitude, uWindAmplitude / 10)

  useFrame(() => {
    uniforms.current.uTime.value = clockRef.current.getElapsedTime()
  })

  return (
    <MeshShorthand object={tree} {...props}>
      <shaderMaterial
        uniforms={uniforms.current}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent={true}
        vertexColors={true}
        alphaTest={0.8}
        fog={true}
        side={THREE.DoubleSide}
      />
    </MeshShorthand>
  )
}

export default Tree
