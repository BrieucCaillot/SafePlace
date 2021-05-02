import React, { forwardRef, RefObject, useEffect, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'

import useJourneyStore from '@/stores/useJourneyStore'
import useAudioStore from '@/stores/useAudioStore'
import JourneySection from '@/constants/enums/JourneySection'
import Place from '@/constants/enums/Place'
import Ambiants from '@/constants/enums/Ambiant'
import { VoiceoverJourney } from '@/constants/enums/Voiceover'

import Waterfall from '@/components/canvas/Waterfall/Waterfall'
import WaterfallCamera from '@/components/Journey/Canvas/Scenes/Waterfall/WaterfallCamera'
import withScenePortal from '@/components/common/Scenes/withScenePortal'
import JourneySky from '@/components/Journey/Canvas/Decorations/JourneySky'

const WaterfallScene = forwardRef((_, camRef: RefObject<THREE.Camera>) => {
  const gltf = useGLTF('/models/journey/chapter3.glb')

  const isToBridgeSection = useJourneyStore(
    (s) => s.currentSection === JourneySection.ToBridge
  )
  const isWaterfallSection = useJourneyStore(
    (s) => s.currentSection === JourneySection.Waterfall
  )
  const isOutroSection = useJourneyStore(
    (s) => s.currentSection === JourneySection.Outro
  )

  const [cameras, mountains, rocks, slats, waterfall] = useMemo(
    () => [...gltf.scene.children],
    []
  )

  const [camAnims, slatAnims] = useMemo(() => {
    const [cam1, cam2, cam3, ...slatsAnims] = gltf.animations
    return [[cam1, cam2, cam3], [...slatsAnims]]
  }, [])

  const cameraOffset = useMemo(() => cameras.position.toArray(), [])

  const setCurrentAmbiant = useAudioStore((s) => s.setCurrentAmbiant)
  const setCurrentVoiceover = useAudioStore((s) => s.setCurrentVoiceover)

  useEffect(() => {
    if (!isToBridgeSection) return
    // Ambiant
    setCurrentAmbiant(Place.Journey, Ambiants.Waterfall)
    // Voiceover
    setCurrentVoiceover(Place.Journey, VoiceoverJourney.Bridge)
  }, [isToBridgeSection])

  useEffect(() => {
    if (!isWaterfallSection) return
    // Voiceover
    setCurrentVoiceover(Place.Journey, VoiceoverJourney.Waterfall)
  }, [isWaterfallSection])

  useEffect(() => {
    if (!isOutroSection) return
    // Voiceover
    setCurrentVoiceover(Place.Journey, VoiceoverJourney.Outro)
  }, [isOutroSection])

  return (
    <>
      <group position={cameraOffset}>
        <WaterfallCamera clips={camAnims} ref={camRef} />
      </group>

      <JourneySky />

      <primitive object={mountains} />
      <primitive object={rocks} />
      <primitive object={slats} />
      <primitive object={waterfall} />

      <Waterfall scale={[7, 7, 7]} position={[-5.5, 0, 0]} />
    </>
  )
})

export default withScenePortal(WaterfallScene)
