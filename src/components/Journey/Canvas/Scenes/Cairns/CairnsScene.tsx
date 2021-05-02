import React, { forwardRef, RefObject, useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'
import { useFrame } from 'react-three-fiber'

import useJourneyStore from '@/stores/useJourneyStore'
import useAudioStore from '@/stores/useAudioStore'
import useThreeAnimation from '@/hooks/animation/useThreeAnimation'
import { VoiceoverJourney } from '@/constants/enums/Voiceover'
import JourneySection from '@/constants/enums/JourneySection'
import Place from '@/constants/enums/Place'

import ClassicCamera from '@/components/common/Canvas/ClassicCamera'
import withScenePortal from '@/components/common/Scenes/withScenePortal'
import JourneySky from '@/components/Journey/Canvas/Decorations/JourneySky'
import { Howl } from 'howler'

const CairnsScene = forwardRef((_, camRef: RefObject<THREE.Camera>) => {
  const {
    scene,
    animations: [camAnim],
  } = useGLTF('/models/journey/chapter1.glb')

  const containerRef = useRef<THREE.Group>()

  const isCairnSection = useJourneyStore(
    (s) => s.currentSection === JourneySection.Cairns
  )
  const setSection = useJourneyStore((s) => s.setSection)

  const { cameraGroup, camera } = useMemo(() => {
    const cameraGroup = scene.getObjectByName('camera')
    return {
      cameraGroup,
      camera: cameraGroup.children[0].children[0] as THREE.PerspectiveCamera,
    }
  }, [])

  const animRef = useThreeAnimation({
    clip: isCairnSection ? camAnim : null,
    ref: containerRef,
    onFinished: () => setSection(JourneySection.Lake),
  })

  /**
   * Voiceover
   */
  const setCurrentVoiceover = useAudioStore(
    (state) => state.setCurrentVoiceover
  )

  useEffect(() => {
    if (!isCairnSection) return
    setCurrentVoiceover(Place.Journey, VoiceoverJourney.Cairns)
  }, [isCairnSection])

  useFrame(
    () =>
      animRef.current != null &&
      !animRef.current.paused &&
      containerRef.current != null &&
      containerRef.current.updateMatrixWorld()
  )

  return (
    <>
      {/* <ClassicCamera ref={camRef} /> */}
      <group
        ref={containerRef}
        position={cameraGroup.position}
        quaternion={cameraGroup.quaternion}
      >
        <ClassicCamera
          ref={camRef}
          fov={camera.fov}
          rotation-x={-Math.PI / 2}
          position={[0, 0, 0]}
        />
      </group>
      <JourneySky />
      <primitive object={scene} />
    </>
  )
})

export default withScenePortal(CairnsScene)
