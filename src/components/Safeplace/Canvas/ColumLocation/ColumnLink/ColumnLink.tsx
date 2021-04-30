import * as THREE from 'three'
import { useControls } from 'leva'
import { MeshProps, useFrame, useThree } from 'react-three-fiber'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import EasingFunction from 'easing-functions'

import useSafeplaceStore from '@/stores/useSafeplaceStore'
import SafeplacePOI from '@/constants/enums/SafeplacePOI'
import useAnimateVector from '@/hooks/animation/useAnimateVector'

import vertexShader from './ColumnLink.vert'
import fragmentShader from './ColumnLink.frag'

const ColumnLink = ({
  safeplacePOI,
  show,
  ...meshProps
}: { safeplacePOI: SafeplacePOI; show: boolean } & Omit<
  MeshProps,
  'scale'
>) => {
  // -- State
  const setCurrentPOI = useSafeplaceStore((s) => s.setCurrentPOI)
  const { camera, viewport } = useThree()
  const [scale, setScale] = useState<THREE.Vector3Tuple>(
    show ? [1, 1, 1] : [0, 0, 0]
  )

  const { scalarFactor } = useControls(
    'column_button',
    {
      scalarFactor: 2,
    },
    { collapsed: true, render: () => false }
  )

  // -- Refs
  const columnLinkRef = useRef<THREE.Mesh>()
  const vec3Ref = useMemo(() => new THREE.Vector3(), [])
  const scaleRef = useRef<THREE.Vector3>(new THREE.Vector3(...scale))

  // -- Anim
  useFrame(() => {
    if (columnLinkRef.current == null || !columnLinkRef.current.visible) return
    const { width, height } = viewport(
      camera,
      columnLinkRef.current?.getWorldPosition(vec3Ref) as THREE.Vector3
    )

    columnLinkRef.current?.quaternion.copy(camera.quaternion)
    columnLinkRef.current?.scale
      .setScalar((height * scalarFactor) / 200)
      .multiply(scaleRef.current)
  })

  const uniforms = useRef<{ [name: string]: THREE.IUniform }>({
    uColor: { value: new THREE.Color('rgba(59, 130, 246, 1.0)') },
  })

  useAnimateVector(scaleRef, scale, {
    duration: 0.8,
    ease: EasingFunction.Quartic.Out,
    onUpdate: () => {
      if (columnLinkRef.current == null) return
      columnLinkRef.current.visible = scaleRef.current.x > 0
    },
  })

  // -- Callbacks
  useEffect(() => {
    setScale(show ? [1, 1, 1] : [0, 0, 0])
  }, [show])

  return (
    <mesh
      {...meshProps}
      ref={columnLinkRef}
      renderOrder={1}
      onClick={() => (show ? setCurrentPOI(safeplacePOI) : null)}
      onPointerOver={() => show && setScale([1.4, 1.4, 1.4])}
      onPointerOut={() => show && setScale([1, 1, 1])}
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
