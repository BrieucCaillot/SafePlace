import React, { forwardRef, RefObject, useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'
import { useFrame } from 'react-three-fiber'

import useJourneyStore from '@/stores/useJourneyStore'
import useAudioStore from '@/stores/useAudioStore'
import useThreeAnimation from '@/hooks/animation/useThreeAnimation'
import { VoiceoverJourney } from '@/constants/enums/Voiceover'
import JourneySection from '@/constants/enums/JourneySection'
import Ambiants from '@/constants/enums/Ambiant'
import Place from '@/constants/enums/Place'

import ClassicCamera from '@/components/common/Canvas/ClassicCamera'
import withScenePortal from '@/components/common/Scenes/withScenePortal'
import JourneySky from '@/components/Journey/Canvas/Decorations/JourneySky'

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

  const cameraGroup = useMemo(() => scene.getObjectByName('camera'), [])

  const animRef = useThreeAnimation({
    clip: isCairnSection ? camAnim : null,
    ref: containerRef,
    onFinished: () => setSection(JourneySection.Lake),
  })

  const setCurrentAmbiant = useAudioStore((s) => s.setCurrentAmbiant)
  const setCurrentVoiceover = useAudioStore((s) => s.setCurrentVoiceover)

  useEffect(() => {
    if (!isCairnSection) return
    // Ambiant
    setCurrentAmbiant(Place.Journey, Ambiants.Cairns)
    // Voiceover
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
          fov={54.9}
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
