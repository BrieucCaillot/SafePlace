import * as THREE from 'three'
import { useMemo, useRef, useState } from 'react'
import { MeshProps, useFrame, useThree } from 'react-three-fiber'

import useSafeplaceStore, { SafeplacePOI } from '@/stores/useSafeplaceStore'

import vertexShader from './ColumnLink.vert'
import fragmentShader from './ColumnLink.frag'
import { useControls } from 'leva'

const ColumnLink = ({
  safeplacePOI,
  ...meshProps
}: { safeplacePOI: SafeplacePOI } & Omit<MeshProps, 'scale'>) => {
  const columnLinkRef = useRef<THREE.Mesh>()

  const { camera, viewport, aspect } = useThree()
  const vec3Ref = useMemo(() => new THREE.Vector3(), [])

  const { scalarFactor } = useControls(
    'safeplace_interaction',
    {
      scalarFactor: 2,
    },
    { collapsed: true }
  )

  const setCurrentPOI = useSafeplaceStore((state) => state.setCurrentPOI)

  const [scaleAnim, setScaleAnim] = useState<THREE.Vector3Tuple>([1, 1, 1])
  const scaleAnimRef = useRef<THREE.Vector3>(new THREE.Vector3(...scaleAnim))

  useFrame(() => {
    const { width, height } = viewport(
      camera,
      columnLinkRef.current?.getWorldPosition(vec3Ref) as THREE.Vector3
    )

    columnLinkRef.current?.quaternion.copy(camera.quaternion)
    columnLinkRef.current?.scale
      .setScalar((height * scalarFactor) / 200)
      .multiply(scaleAnimRef.current)
  })

  const uniforms = useRef<{ [name: string]: THREE.IUniform }>({
    uColor: { value: new THREE.Color('rgba(59, 130, 246, 1.0)') },
  })

  const onClick = () => {
    setCurrentPOI(safeplacePOI)
  }

  const onPointerOver = () => {
    setScaleAnim([2, 2, 2])
  }

  const onPointerOut = () => {
    setScaleAnim([1, 1, 1])
  }

  // useAnimateVector(scaleAnimRef, scaleAnim, {
  //   duration: 2,
  // })

  return (
    <mesh
      {...meshProps}
      ref={columnLinkRef}
      renderOrder={1}
      onClick={onClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      <planeGeometry args={[5, 5, 32, 32]} />
      <rawShaderMaterial
        uniforms={uniforms.current}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        depthTest={false}
        transparent={true}
      />
    </mesh>
  )
}

export default ColumnLink