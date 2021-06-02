import GroupShorthand from '@/components/common/Canvas/GroupShorthand'
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
    }>
  ) => {
    const slats = useMemo(() => [...group.children] as THREE.Mesh[], [])
    const groupRef = useRef<THREE.Group>()

    const slatRefs = useMemo(
      () =>
        new Array(slats.length)
          .fill(null)
          .map((_) => createRef<{ play: () => Promise<any> }>()),
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
    }))

    return (
      <GroupShorthand object={group} ref={groupRef}>
        {slats.map((s, i) => (
          <Slat object={s} anim={getAnim(s.name)} ref={slatRefs[i]} key={i} />
        ))}
      </GroupShorthand>
    )
  }
)

export default Slats
