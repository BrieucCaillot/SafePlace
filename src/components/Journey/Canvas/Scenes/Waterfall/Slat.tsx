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
import { Howl } from 'howler'
import SFX from '@/constants/SFX'
import wait from '@/utils/promise/wait'
const Slat = forwardRef(
  (
    {
      object,
      anim,
      volume,
      delay,
    }: {
      object: THREE.Mesh
      anim: THREE.AnimationClip
      volume: number
      delay: number
    },
    ref: ForwardedRef<{ play: () => Promise<any>; instantPlay: () => void }>
  ) => {
    const slatRef = useRef<THREE.Mesh>(null)
    const willPlay = useSceneStore((s) => s.nextScene === SceneName.Waterfall)

    const animArray = useMemo(() => [anim], [anim])

    const audio = useMemo(() => new Howl({ src: SFX.SLAT, volume }), [volume])

    const { actions, mixer } = useAnimations(animArray, slatRef)
    useConfigActions(actions)
    const animation = useAnimManager(actions, mixer)

    useEffect(() => {
      if (!willPlay) return
      animation.init(Object.keys(actions)[0])
      return animation.stop
    }, [willPlay])

    useImperativeHandle(ref, () => ({
      play: () =>
        Promise.all([
          animation.play(Object.keys(actions)[0]),
          wait(delay * 1000).then(() => audio.play()),
        ]),
      instantPlay: () => Object.values(actions)[0].setDuration(0).play(),
    }))

    return <MeshShorthand object={object} ref={slatRef} />
  }
)

export default Slat
