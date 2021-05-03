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
import ClassicCamera from '@/components/common/Canvas/ClassicCamera'
import Slats from './Slats'
import CustomSky from '@/components/canvas/Sky/CustomSky'

const WaterfallScene = forwardRef((_, camRef: RefObject<THREE.Camera>) => {
  const gltf = useGLTF('/models/journey/chapter3.glb')

  const currentSection = useJourneyStore((s) => s.currentSection)

  const [cameras, mountains, rocks, slats, waterfall] = useMemo(
    () => [...gltf.scene.children],
    []
  )

  const [camAnims, slatAnims] = useMemo(() => {
    const [cam1, cam2, cam3, ...slatsAnims] = gltf.animations
    return [[cam1, cam2, cam3], [...slatsAnims]]
  }, [])

  const cameraOffset = useMemo(() => cameras.position.toArray(), [])

  useEffect(() => {
    const { setCurrentAmbiant, setCurrentVoiceover } = useAudioStore.getState()

    switch (currentSection) {
      case JourneySection.ToBridge:
        setCurrentAmbiant(Place.Journey, Ambiants.Waterfall)
        setCurrentVoiceover(Place.Journey, VoiceoverJourney.Bridge)
        break
      case JourneySection.Waterfall:
        setCurrentVoiceover(Place.Journey, VoiceoverJourney.Waterfall)
        break
      case JourneySection.Outro:
        setCurrentVoiceover(Place.Journey, VoiceoverJourney.Outro)
        break
    }
  }, [currentSection])

  return (
    <>
      {/* <ClassicCamera ref={camRef} fov={32.6} /> */}
      <group position={cameraOffset}>
        <WaterfallCamera clips={camAnims} ref={camRef} />
      </group>

      <CustomSky />

      <Slats slatGroup={slats} slatAnims={slatAnims} />

      <primitive object={mountains} />
      <primitive object={rocks} />
      <primitive object={waterfall} />

      <Waterfall scale={[7, 7, 7]} position={[-5.5, 0, 0]} />
    </>
  )
})

export default withScenePortal(WaterfallScene)
