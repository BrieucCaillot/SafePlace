import { useCallback, useEffect, useMemo, useRef } from 'react'
import Slat from './Slat'

const Slats = ({
  slatGroup,
  slatAnims,
  animate = false,
  onAnimFinished = () => {},
}: {
  slatGroup: THREE.Object3D
  slatAnims: THREE.AnimationClip[]
  animate?: boolean
  onAnimFinished: Function
}) => {
  const slats = useMemo(() => [...slatGroup.children] as THREE.Mesh[], [])

  const animationProgress = useRef<Map<THREE.AnimationClip, boolean>>()
  useEffect(() => {
    animationProgress.current = new Map(slatAnims.map((s) => [s, false]))
  }, [animate])

  const getAnim = useCallback(
    (animName: string) => slatAnims.find((a) => a.name.includes(animName)),
    [slatAnims]
  )

  const animCallback = useCallback(
    (anim: THREE.AnimationClip) => {
      animationProgress.current.set(anim, true)
      const finished = [...animationProgress.current.values()].reduce(
        (acc, curr) => curr && acc,
        true
      )
      if (finished) onAnimFinished()
    },
    [onAnimFinished]
  )

  return (
    <group
      position={slatGroup.position}
      rotation={slatGroup.rotation}
      scale={slatGroup.scale}
    >
      {slats.map((s, i) => (
        <Slat
          slatObject={s}
          slatAnim={animate ? getAnim(s.name) : null}
          onAnimFinished={() => animCallback(getAnim(s.name))}
          key={i}
        />
      ))}
    </group>
  )
}

export default Slats
