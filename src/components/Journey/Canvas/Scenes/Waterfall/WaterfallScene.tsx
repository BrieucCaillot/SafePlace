import React, { forwardRef, RefObject, useEffect, useMemo, useRef } from 'react'
import { useAnimations, useGLTF } from '@react-three/drei'
import mergeRefs from 'react-merge-refs'

import useSceneStore from '@/stores/useSceneStore'
import useJourneyStore from '@/stores/useJourneyStore'
import useUserStore from '@/stores/useUserStore'

import SceneName from '@/constants/enums/SceneName'
import VOICEOVER from '@/constants/VOICEOVER'

import Waterfall from '@/components/canvas/Waterfall/Waterfall'
import withScenePortal from '@/components/common/Scenes/withScenePortal'
import CustomSky from '@/components/canvas/Sky/CustomSky'
import SceneShorthand from '@/components/common/Canvas/SceneShorthand'
import ColumnLink from '@/components/Safeplace/Canvas/Columns/ColumnLink/ColumnLink'
import Slats from './Slats'

import useConfigActions from '@/hooks/animation/useConfigActions'
import useAsyncEffect from '@/hooks/promise/useAsyncEffect'
import useAnimManager from '@/hooks/animation/useAnimManager'
import useBooleanPromise from '@/hooks/promise/useBooleanPromise'

import Routes from '@/constants/enums/Routes'
import useAudioManager from '@/hooks/audio/useAudioManager'
import GroupShorthand from '@/components/common/Canvas/GroupShorthand'
import WaterfallGround from './WaterfallGround'
import useMouseRotation from '@/hooks/animation/useMouseRotation'
import wait from '@/utils/promise/wait'
import useSceneControls from '@/hooks/three/useSceneControls'
import useSectionProgress from '@/hooks/journey/useSectionProgress'
import JourneySection from '@/constants/enums/JourneySection'

const WaterfallScene = forwardRef((_, camRef: RefObject<THREE.Camera>) => {
  // REFS
  const gltf = useGLTF('/models/journey/chapter3.glb')

  const [slats, rocks, waterfall, cameras, background] = useMemo(
    () =>
      ['slats', 'rocks', 'waterfall', 'cameras', 'background'].map((n) =>
        gltf.scene.children.find((o) => o.name.includes(n))
      ),
    []
  )

  const [camAnims, slatAnims] = useMemo(() => {
    const [cam1, cam2, cam3, ...slatsAnims] = gltf.animations.reverse()
    return [[cam1, cam2, cam3], [...slatsAnims]]
  }, [])

  const localCamRef = useRef<THREE.PerspectiveCamera>()
  const camContainer = useRef<THREE.Group>()
  const slatRef = useRef<{
    play: () => Promise<void>
    getGroup: () => RefObject<THREE.Group>
  }>()

  // --- STATE
  const isSettledInScene = useSceneStore(
    (s) => !s.inTransition && s.renderedScene === SceneName.Waterfall
  )
  const willPlay = useSceneStore((s) => s.nextScene === SceneName.Waterfall)
  useSceneControls(SceneName.Waterfall, Routes.Journey)
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
    anim.init('camera_1.002')
    return anim.stop
  }, [willPlay])

  useEffect(() => {
    background.children[0].children.forEach(
      (c) =>
        (((c as THREE.Mesh).material as THREE.MeshBasicMaterial).fog = false)
    )
  }, [])

  useSectionProgress(JourneySection.Waterfall, [
    VOICEOVER.JOURNEY.BRIDGE,
    20000,
    bridgeButtonPromise.isWaiting,
    VOICEOVER.JOURNEY.WATERFALL,
  ])

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
          anim.play('camera_1.002'), //---
          audio.play(VOICEOVER.JOURNEY.BRIDGE), //---
        ])
      )
      await wrap(slatRef.current.play())
      await wrap(bridgeButtonPromise.wait())
      await wrap(
        Promise.all([
          anim.play('camera_2'), //---
          audio.play(VOICEOVER.JOURNEY.WATERFALL), //---
        ])
      )
      setShowShelterButton(false)
      await wrap(waitEndButton())
      setJourneyStatus(true)
      wrap(
        Promise.all([
          anim.play('camera_3'), //---
          audio.play(VOICEOVER.JOURNEY.OUTRO), //---
        ])
      )
      await wrap(wait(35_000))
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

  useMouseRotation(localCamRef, {
    offset: [-Math.PI / 2, 0, 0],
    amplitude: 0.02,
    easing: 0.01,
  })

  return (
    <>
      {/* <ClassicCamera ref={camRef} fov={32.4} /> */}
      <GroupShorthand object={cameras}>
        <group ref={camContainer}>
          <perspectiveCamera
            ref={mergeRefs([camRef, localCamRef])}
            rotation-x={-Math.PI / 2}
            near={0.1}
            far={1000}
            fov={32.4}
          />
          {/* <mesh>
            <boxBufferGeometry args={[1, 1, 1]} />
            <meshNormalMaterial />
          </mesh> */}
        </group>
      </GroupShorthand>

      <CustomSky />

      <SceneShorthand object={background} />
      <SceneShorthand object={rocks} />
      <GroupShorthand object={waterfall}>
        <SceneShorthand object={waterfall.children[0]} />
        <WaterfallGround object={waterfall.children[1] as THREE.Mesh} />
      </GroupShorthand>

      <Waterfall position-y={0} slats={slatRef} />

      <ColumnLink
        onColumnClick={bridgeButtonPromise.resolve}
        show={bridgeButtonPromise.isWaiting}
        position={[-10, 5, 0]}
      />

      <Slats group={slats} anims={slatAnims} ref={slatRef} />
    </>
  )
})

export default withScenePortal(WaterfallScene)
