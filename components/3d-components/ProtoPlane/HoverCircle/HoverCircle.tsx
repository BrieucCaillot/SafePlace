import useColorUniform from 'hooks/Uniforms/useColorUniform'
import { useCallback, useEffect, useRef, useState } from 'react'
import { SpringValue, useSpring } from 'react-spring'
import { MeshProps, useFrame, useThree } from 'react-three-fiber'
import useHandtrackStore from 'stores/useHandtrackStore'
import * as THREE from 'three'
import fragmentShader from './fragmentShader.frag'
import vertexShader from './vertexShader.vert'
import bezier from 'bezier-easing'
import Easing from 'easing-functions'

const HoverCircle = ({
  onComplete,
  progressIndex,
  color = '#4F76FE',
  ...props
}: MeshProps & {
  color: string
  onComplete: () => void
  progressIndex: number
}) => {
  const defaultCircleProps = {
    outerRadius: 0.9,
    innerRadius: 0,
    outerThickness: 0.15,
    progress: 0,
  }

  /**
   * State setup
   */
  const [isHovered, setIsHovered] = useState<boolean>(false)
  const [isFinished, setIsFinished] = useState<boolean>(false)

  const raycasterTarget = useRef<THREE.Vector2>(new THREE.Vector2())
  const meshRef = useRef<THREE.Mesh>(null)
  const onCompleteRef = useRef<() => void>(onComplete)
  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  const cursor = useHandtrackStore((s) => s.cursor)
  const { raycaster, camera } = useThree()

  const uniforms = useRef<{ [name: string]: THREE.IUniform }>({
    uColor: { value: new THREE.Color('#4F76FE') },
    uInnerRadius: { value: 0 },
    uOuterRadius: { value: 0 },
    uOuterThickness: { value: 0 },
  })
  useColorUniform(uniforms.current.uColor, color)

  /**
   * Spring setup
   */
  const updateUniforms = useCallback((v: number, s: SpringValue) => {
    if (s.key === undefined || s.key === 'progress') return
    const uniformName = `u${s.key.charAt(0).toUpperCase() + s.key.slice(1)}`
    uniforms.current[uniformName].value = v
  }, [])

  const onAnimationEnd = useCallback(
    ({ value, target }: { value: number; target: SpringValue }) => {
      if (target.key !== 'progress') return
      if (value === 1) setIsFinished(true)
      if (value === 2) onCompleteRef.current()
    },
    []
  )

  const [_, set] = useSpring(() => ({
    outerRadius: 0,
    innerRadius: 0,
    outerThickness: 0,
    progress: 0,
    config: { easing: bezier(0.47, 0, 1, 1), duration: 2500 },
    onRest: onAnimationEnd as () => void,
    onChange: updateUniforms as () => void,
  }))

  /**
   * Raycast
   */
  useFrame(() => {
    if (meshRef.current === null) return
    raycasterTarget.current.set(-(cursor.x * 2 - 1), -(cursor.y * 2 - 1))
    raycaster.setFromCamera(raycasterTarget.current, camera)
    const intersections = raycaster.intersectObject(meshRef.current)

    const newIsHovered = intersections.length > 0
    if (newIsHovered !== isHovered) setIsHovered(newIsHovered)
  })

  /**
   * Imperative animation
   */
  useEffect(() => {
    if (isFinished) {
      set({
        innerRadius: 0,
        outerRadius: 0,
        outerThickness: 0,
        progress: 2,
        config: {
          easing: Easing.Quartic.In,
          duration: 600,
        },
      })
      return
    }
    if (isHovered)
      set({
        innerRadius: 0.6,
        outerRadius: 0.6,
        progress: 1,
        config: { duration: 1500 },
      })
    else
      set({
        ...defaultCircleProps,
        config: { duration: 700 },
      })
  }, [isHovered, isFinished])

  useEffect(() => {
    set({ ...defaultCircleProps, config: { duration: 0 } })
    setIsFinished(false)
    setIsHovered(false)
  }, [progressIndex])

  return (
    <mesh {...props} ref={meshRef}>
      <planeBufferGeometry args={[0.1, 0.1]} />
      <rawShaderMaterial
        uniforms={uniforms.current}
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        transparent={true}
      />
    </mesh>
  )
}

export default HoverCircle
