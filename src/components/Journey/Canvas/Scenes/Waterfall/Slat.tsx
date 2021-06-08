import MeshShorthand from '@/components/common/Canvas/MeshShorthand'
import SceneName from '@/constants/enums/SceneName'
import useConfigActions from '@/hooks/animation/useConfigActions'
import useAnimManager from '@/hooks/animation/useAnimManager'
import useSceneStore from '@/stores/useSceneStore'
import promisifyAction from '@/utils/promise/promisifyAction'
import { useAnimations } from '@react-three/drei'
import {
  ForwardedRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react'
import * as THREE from 'three'
const Slat = forwardRef(
  (
    {
      object,
      anim,
    }: {
      object: THREE.Mesh
      anim: THREE.AnimationClip
    },
    ref: ForwardedRef<{ play: () => Promise<any> }>
  ) => {
    const slatRef = useRef<THREE.Mesh>(null)
    const willPlay = useSceneStore((s) => s.nextScene === SceneName.Waterfall)

    const animArray = useMemo(() => [anim], [anim])

    const { actions, mixer } = useAnimations(animArray, slatRef)
    useConfigActions(actions)
    const animation = useAnimManager(actions, mixer)

    useEffect(() => {
      if (!willPlay) return
      animation.init(Object.keys(actions)[0])
      return animation.stop
    }, [willPlay])

    useImperativeHandle(ref, () => ({
      play: () => animation.play(Object.keys(actions)[0]),
    }))

    return <MeshShorthand object={object} ref={slatRef} />
  }
)

export default Slat
