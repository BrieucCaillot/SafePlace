import MeshShorthand from '@/components/common/Canvas/MeshShorthand'
import SceneName from '@/constants/enums/SceneName'
import useConfigActions from '@/hooks/animation/useConfigActions'
import useInitAnimation from '@/hooks/animation/useInitAnimation'
import useSceneStore from '@/stores/useSceneStore'
import promisifyAction from '@/utils/promise/promisifyAction'
import { useAnimations } from '@react-three/drei'
import { ForwardedRef, forwardRef, useImperativeHandle, useRef } from 'react'
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
    const { actions, mixer } = useAnimations([anim], slatRef)
    const onScene = useSceneStore(
      (s) => s.renderedScene === SceneName.Waterfall
    )

    useConfigActions(actions)
    useInitAnimation(actions, null, onScene)

    useImperativeHandle(ref, () => ({
      play: () => {
        const action = Object.values(actions)[0]
        action.play()
        action.paused = false
        return promisifyAction(mixer, action)
      },
    }))

    return <MeshShorthand object={object} ref={slatRef} />
  }
)

export default Slat
