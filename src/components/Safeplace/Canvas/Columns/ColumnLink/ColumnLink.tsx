import * as THREE from 'three'
import { MeshProps, useFrame, useThree } from 'react-three-fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import EasingFunction from 'easing-functions'

import useAnimateVector from '@/hooks/animation/useAnimateVector'

import vertexShader from '@/components/Safeplace/Canvas/Columns/ColumnLink/ColumnLink.vert'
import fragmentShader from '@/components/Safeplace/Canvas/Columns/ColumnLink/ColumnLink.frag'
import useAudioStore from '@/stores/useAudioStore'
import SFX from '@/constants/SFX'

const ColumnLink = ({
  show,
  onColumnClick,
  size = 3,
  ...meshProps
}: {
  show: boolean
  size?: number
  onColumnClick: Function
} & Omit<MeshProps, 'scale'>) => {
  // -- State
  const { camera, viewport } = useThree()
  const [hover, setHover] = useState(false)
  const [scale, setScale] = useState<THREE.Vector3Tuple>(
    show ? [1, 1, 1] : [0, 0, 0]
  )

  // -- Refs
  const columnLinkRef = useRef<THREE.Mesh>()
  const vec3Ref = useMemo(() => new THREE.Vector3(), [])
  const audio = useAudioStore((s) => s.initAudio(SFX.BUTTON))
  const scaleRef = useRef<THREE.Vector3>(new THREE.Vector3(...scale))

  const linkTexture = useMemo(
    () => new THREE.TextureLoader().load('/img/safeplace/link.png'),
    []
  )

  const uniforms = useRef<{ [name: string]: THREE.IUniform }>({
    uTexture: { value: linkTexture },
  })

  // -- Anim
  useFrame(() => {
    if (columnLinkRef.current == null || !columnLinkRef.current.visible) return
    const { width, height } = viewport(
      camera,
      columnLinkRef.current?.getWorldPosition(vec3Ref) as THREE.Vector3
    )

    camera.getWorldQuaternion(columnLinkRef.current?.quaternion)
    columnLinkRef.current?.scale
      .setScalar((height * size) / 200)
      .multiply(scaleRef.current)
  })

  useAnimateVector(scaleRef, scale, {
    duration: 1,
    ease: EasingFunction.Quartic.Out,
    onUpdate: () => {
      if (columnLinkRef.current == null) return
      columnLinkRef.current.visible = scaleRef.current.x > 0
    },
  })

  // -- Callbacks
  useEffect(() => {
    if (show) {
      const cursor = document.querySelector('#cursor')
      cursor.classList.toggle('is-hovering', hover)
      setScale(hover ? [1.4, 1.4, 1.4] : [1, 1, 1])
    } else {
      setScale([0, 0, 0])
    }
  }, [show, hover])

  const pointerHandlers = useMemo(() => {
    if (!show) return {}
    return {
      onClick: () => (onColumnClick(), setHover(false)),
      onPointerOver: () => (setHover(true), !audio.playing() && audio.play()),
      onPointerOut: () => setHover(false),
    }
  }, [show])

  return (
    <mesh
      {...meshProps}
      ref={columnLinkRef}
      renderOrder={1}
      {...pointerHandlers}
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
