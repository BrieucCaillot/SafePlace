import GroupShorthand from '@/components/common/Canvas/GroupShorthand'
import { useControls } from 'leva'
import {
  createRef,
  ForwardedRef,
  forwardRef,
  RefObject,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react'
import Slat from './Slat'

const Slats = forwardRef(
  (
    {
      group,
      anims,
    }: {
      group: THREE.Object3D
      anims: THREE.AnimationClip[]
    },
    ref: ForwardedRef<{
      play: () => Promise<any>
      getGroup: () => RefObject<THREE.Group>
      instantPlay: () => void
    }>
  ) => {
    const slats = useMemo(() => [...group.children] as THREE.Mesh[], [])
    const groupRef = useRef<THREE.Group>()

    const { volume, decay } = useControls(
      'audio.slats',
      {
        volume: { min: 0, max: 1, value: 0.35 },
        decay: { min: 0, max: 1, value: 0.07 },
      },
      { collapsed: true }
    )

    const slatRefs = useMemo(
      () =>
        new Array(slats.length)
          .fill(null)
          .map((_) =>
            createRef<{ play: () => Promise<any>; instantPlay: () => void }>()
          ),
      []
    )

    const getAnim = useCallback(
      (animName: string) =>
        anims.find(
          (a) =>
            a.name.substring(a.name.length - 1) ===
            animName.substring(animName.length - 1)
        ),
      [anims]
    )

    useImperativeHandle(ref, () => ({
      play: () => Promise.all(slatRefs.map((r) => r.current.play())),
      getGroup: () => groupRef,
      instantPlay: () => slatRefs.map((r) => r.current.instantPlay()),
    }))

    return (
      <GroupShorthand object={group} ref={groupRef}>
        {slats.map((s, i) => (
          <Slat
            object={s}
            anim={getAnim(s.name)}
            ref={slatRefs[i]}
            key={i}
            volume={volume - decay * i}
            delay={2.283 * i + 7.933}
          />
        ))}
      </GroupShorthand>
    )
  }
)

export default Slats
