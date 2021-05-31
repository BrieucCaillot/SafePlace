import React, { forwardRef, RefObject, useEffect, useMemo, useRef } from 'react'
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
import useAnimManager from '@/hooks/animation/useAnimManager'
import useBooleanPromise from '@/hooks/promise/useBooleanPromise'

import Routes from '@/constants/enums/Routes'
import useAudioManager from '@/hooks/audio/useAudioManager'

const WaterfallScene = forwardRef((_, camRef: RefObject<THREE.Camera>) => {
  // REFS
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

  // --- STATE
  const isSettledInScene = useSceneStore(
    (s) => !s.inTransition && s.renderedScene === SceneName.Waterfall
  )
  const willPlay = useSceneStore((s) => s.nextScene === SceneName.Waterfall)
  const bridgeButtonPromise = useBooleanPromise()

  const audio = useAudioManager([
    VOICEOVER.JOURNEY.BRIDGE,
    VOICEOVER.JOURNEY.WATERFALL,
    VOICEOVER.JOURNEY.OUTRO,
  ])

  // --- ANIMATIONS
  const { actions, mixer } = useAnimations(camAnims, camContainer)

  const anim = useAnimManager(actions, mixer)
  useConfigActions(actions)

  useEffect(() => {
    if (!willPlay) return
    anim.init('Camera_1')
    return anim.stop
  }, [willPlay])

  useAsyncEffect(
    async (wrap) => {
      if (!isSettledInScene) return

      const { setJourneyStatus, router } = useUserStore.getState()
      const {
        setEndButtonCallback,
        setShowShelterButton,
      } = useJourneyStore.getState()

      const waitEndButton = () =>
        new Promise<void>((res) =>
          setEndButtonCallback(() => {
            res()
            setEndButtonCallback(null)
          })
        )

      await wrap(
        Promise.all([
          anim.play('Camera_1'), //---
          audio.play(VOICEOVER.JOURNEY.BRIDGE), //---
        ])
      )
      await wrap(slatRef.current.play())
      await wrap(bridgeButtonPromise.wait())
      await wrap(
        Promise.all([
          anim.play('Camera_2'), //---
          audio.play(VOICEOVER.JOURNEY.WATERFALL), //---
        ])
      )
      setShowShelterButton(false)
      await wrap(waitEndButton())
      setJourneyStatus(true)
      await wrap(
        Promise.all([
          anim.play('Camera_3'), //---
          audio.play(VOICEOVER.JOURNEY.OUTRO), //---
        ])
      )
      router.push(Routes.Resources)
    },
    () => {
      const {
        setEndButtonCallback,
        setShowShelterButton,
      } = useJourneyStore.getState()
      setEndButtonCallback(null)
      setShowShelterButton(true)
      audio.stop()
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
