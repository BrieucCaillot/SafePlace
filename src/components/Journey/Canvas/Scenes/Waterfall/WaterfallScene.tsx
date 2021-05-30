import React, { forwardRef, RefObject, useMemo, useRef } from 'react'
import { useAnimations, useGLTF } from '@react-three/drei'

import useAudioStore from '@/stores/useAudioStore'
import useSceneStore from '@/stores/useSceneStore'
import useJourneyStore from '@/stores/useJourneyStore'
import useUserStore from '@/stores/useUserStore'

import SceneName from '@/constants/enums/SceneName'
import VOICEOVER from '@/constants/VOICEOVER'

import Waterfall from '@/components/canvas/Waterfall/Waterfall'
import withScenePortal from '@/components/common/Scenes/withScenePortal'
import CustomSky from '@/components/canvas/Sky/CustomSky'
import SceneShorthand from '@/components/common/Canvas/SceneShorthand'
import ColumnLink from '@/components/Safeplace/Canvas/ColumLocation/ColumnLink/ColumnLink'
import PortalUI from '@/components/common/UI/PortalUI'
import Slats from './Slats'

import useConfigActions from '@/hooks/animation/useConfigActions'
import useAsyncEffect from '@/hooks/promise/useAsyncEffect'
import useInitAnimation from '@/hooks/animation/useInitAnimation'
import useBooleanPromise from '@/hooks/promise/useBooleanPromise'

import promisifyAction from '@/utils/promise/promisifyAction'
import Routes from '@/constants/enums/Routes'

const WaterfallScene = forwardRef((_, camRef: RefObject<THREE.Camera>) => {
  // GLTF
  const gltf = useGLTF('/models/journey/chapter3.glb')

  const [cameras, mountains, rocks, slats, waterfall] = useMemo(
    () => [...gltf.scene.children],
    []
  )

  const [camAnims, slatAnims] = useMemo(() => {
    const [cam1, cam2, cam3, ...slatsAnims] = gltf.animations
    return [[cam1, cam2, cam3], [...slatsAnims]]
  }, [])

  const cameraOffset = useMemo(() => cameras.position.toArray(), [])
  const camContainer = useRef<THREE.Group>()
  const slatRef = useRef<{ play: () => Promise<void> }>()

  const isSettledInScene = useSceneStore(
    (s) => !s.inTransition && s.renderedScene === SceneName.Waterfall
  )

  const onScene = useSceneStore((s) => s.renderedScene === SceneName.Waterfall)

  const { actions, mixer } = useAnimations(camAnims, camContainer)
  useInitAnimation(actions, 'Camera_1', onScene)
  useConfigActions(actions)

  const bridgeButtonPromise = useBooleanPromise()

  useAsyncEffect(
    async (wrap) => {
      if (!isSettledInScene) return

      const { play } = useAudioStore.getState()
      const { setJourneyStatus, router } = useUserStore.getState()
      const { setEndButtonCallback } = useJourneyStore.getState()
      const {
        ['Camera_1']: cam1,
        ['Camera_2']: cam2,
        ['Camera_3']: cam3,
      } = actions

      const waitEndButton = () =>
        new Promise<void>((res) =>
          setEndButtonCallback(() => {
            res()
            setEndButtonCallback(null)
          })
        )

      const playAnim = (action: THREE.AnimationAction) => {
        action.play()
        action.paused = false
        return promisifyAction(mixer, action)
      }

      await wrap(
        Promise.all([
          playAnim(cam1), //---
          play(VOICEOVER.JOURNEY.BRIDGE), //---
        ])
      )
      await wrap(slatRef.current.play())
      await wrap(bridgeButtonPromise.wait())
      await wrap(
        Promise.all([
          playAnim(cam2), //---
          play(VOICEOVER.JOURNEY.WATERFALL), //---
        ])
      )
      await wrap(waitEndButton())
      setJourneyStatus(true)
      await wrap(
        Promise.all([
          playAnim(cam3), //---
          play(VOICEOVER.JOURNEY.OUTRO), //---
        ])
      )
      router.push(Routes.Safeplace)
    },
    () => {
      useJourneyStore.getState().setEndButtonCallback(null)
      const { stop } = useAudioStore.getState()
      stop(VOICEOVER.JOURNEY.BRIDGE)
      stop(VOICEOVER.JOURNEY.WATERFALL)
      stop(VOICEOVER.JOURNEY.OUTRO)
    },
    [isSettledInScene]
  )

  return (
    <>
      {/* <ClassicCamera ref={camRef} fov={32.6} /> */}
      <group position={cameraOffset}>
        <group ref={camContainer}>
          <perspectiveCamera
            ref={camRef}
            rotation-x={-Math.PI / 2}
            near={0.1}
            far={1000}
            fov={32.6}
          />
          {/* <mesh>
            <boxBufferGeometry args={[1, 1, 1]} />
            <meshNormalMaterial />
          </mesh> */}
        </group>
      </group>

      <CustomSky />

      <SceneShorthand object={mountains} />
      <SceneShorthand object={rocks} />
      <SceneShorthand object={waterfall} />

      <Waterfall scale={[7, 7, 7]} position={[-5.5, 0, 0]} />

      <ColumnLink
        onColumnClick={bridgeButtonPromise.resolve}
        show={bridgeButtonPromise.isWaiting}
      />

      <Slats group={slats} anims={slatAnims} ref={slatRef} />
    </>
  )
})

export default withScenePortal(WaterfallScene)
