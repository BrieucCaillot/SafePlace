import * as THREE from 'three'
import { useEffect, useMemo, useRef, useState, RefObject } from 'react'
import { useFrame, useThree } from 'react-three-fiber'

import gsap from 'gsap'
import useSafeplaceStore, { SafeplacePOI } from '@/stores/useSafeplaceStore'
import useVector3Uniform from '@/hooks/uniforms/useVector3Uniform'

import vertexShader from './safeplaceInteraction.vert'
import fragmentShader from './safeplaceInteraction.frag'
import useCameraStore from '@/stores/useCameraStore'
import useAnimateVector from '@/hooks/animation/useAnimateVector'
import { useControls } from 'leva'

const config = {
  inactive: {
    color: 'rgba(103, 108, 117, 1)',
    scale: new THREE.Vector2(1, 1),
  },
  active: {
    color: 'rgba(59, 130, 246, 0.5)',
    scale: new THREE.Vector2(1, 1),
  },
  hover: {
    color: 'rgba(59, 130, 246, 0.5)',
    scale: new THREE.Vector2(2, 2),
  },
}

const SafeplaceInteraction = ({ safeplacePOI }) => {
  const safeplaceInteractionRef = useRef<THREE.Mesh>()

  const { camera, viewport, aspect } = useThree()
  const vec3Ref = useMemo(() => new THREE.Vector3(), [])

  const { scalarFactor } = useControls('Safeplace Interaction', {
    scalarFactor: 2,
  })

  const cameraIsTravelling = useCameraStore((state) => state.cameraIsTravelling)
  const currentPOI = useSafeplaceStore((state) => state.currentPOI)
  const setCurrentPOI = useSafeplaceStore((state) => state.setCurrentPOI)

  const [scaleAnim, setScaleAnim] = useState<THREE.Vector3Tuple>([1, 1, 1])
  const scaleAnimRef = useRef<THREE.Vector3>(new THREE.Vector3())

  useFrame(() => {
    const vpToQuad = viewport(
      camera,
      safeplaceInteractionRef.current?.getWorldPosition(
        vec3Ref
      ) as THREE.Vector3
    )
    const { width, height } = vpToQuad

    safeplaceInteractionRef.current?.scale
      .setScalar((height * scalarFactor) / 200)
      .multiply(scaleAnimRef.current)
  })

  const uniforms = useRef<{ [name: string]: THREE.IUniform }>({
    uColor: { value: new THREE.Color('rgba(59, 130, 246, 1.0)') },
  })

  const onClick = () => {
    if (cameraIsTravelling) return
    if (currentPOI == SafeplacePOI.Inside) setCurrentPOI(safeplacePOI)
  }

  const onPointerOver = () => {
    setScaleAnim([2, 2, 2])
  }

  const onPointerOut = () => {
    setScaleAnim([1, 1, 1])
  }

  useAnimateVector(scaleAnimRef, scaleAnim, {
    duration: 2,
  })

  return (
    <mesh
      ref={safeplaceInteractionRef}
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

export default SafeplaceInteraction
