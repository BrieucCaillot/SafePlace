import React, {
  forwardRef,
  RefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useGLTF } from '@react-three/drei'

import useJourneyStore from '@/stores/useJourneyStore'
import useUserStore from '@/stores/useUserStore'
import useAudioStore from '@/stores/useAudioStore'
import JourneySection from '@/constants/enums/JourneySection'
import Place from '@/constants/enums/Place'
import Ambiants from '@/constants/enums/Ambiant'
import AudioStatus from '@/constants/enums/Audio'
import { VoiceoverJourney } from '@/constants/enums/Voiceover'

import Waterfall from '@/components/canvas/Waterfall/Waterfall'
import WaterfallCamera from '@/components/Journey/Canvas/Scenes/Waterfall/WaterfallCamera'
import withScenePortal from '@/components/common/Scenes/withScenePortal'
import ClassicCamera from '@/components/common/Canvas/ClassicCamera'
import Slats from './Slats'
import CustomSky from '@/components/canvas/Sky/CustomSky'
import ColumnLink from '@/components/Safeplace/Canvas/ColumLocation/ColumnLink/ColumnLink'

const WaterfallScene = forwardRef((_, camRef: RefObject<THREE.Camera>) => {
  // TODO: Rework sequence be using one side section
  // TODO: Waterfall flickers
  const gltf = useGLTF('/models/journey/chapter3.glb')

  const currentSection = useJourneyStore((s) => s.currentSection)

  const [slatsAnimated, setSlatAnimated] = useState(0)
  const [buttonClicked, setButtonClicked] = useState(false)
  const [inFrontOfBridge, setInFrontOfBridge] = useState(false)

  const [cameras, mountains, rocks, slats, waterfall] = useMemo(
    () => [...gltf.scene.children],
    []
  )

  const [camAnims, slatAnims] = useMemo(() => {
    const [cam1, cam2, cam3, ...slatsAnims] = gltf.animations
    return [[cam1, cam2, cam3], [...slatsAnims]]
  }, [])

  const cameraOffset = useMemo(() => cameras.position.toArray(), [])

  const isVoiceoverWaterfallFinished = useAudioStore((s) =>
    s.checkVoiceoverStatus(VoiceoverJourney.Waterfall, AudioStatus.Played)
  )
  useEffect(() => {
    if (isVoiceoverWaterfallFinished) {
      useJourneyStore.getState().setSection(JourneySection.Outro)
    }
  }, [isVoiceoverWaterfallFinished])

  const isVoiceoverOutroFinished = useAudioStore((s) =>
    s.checkVoiceoverStatus(VoiceoverJourney.Outro, AudioStatus.Played)
  )
  useEffect(() => {
    if (isVoiceoverOutroFinished) {
      const { setIsJourneyCompleted } = useUserStore.getState()
      setIsJourneyCompleted(true)
    }
  }, [isVoiceoverOutroFinished])

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

  const animateSlats = useMemo(
    () =>
      [
        JourneySection.ToBridge,
        JourneySection.Bridge,
        JourneySection.Waterfall,
        JourneySection.Outro,
      ].includes(currentSection) && buttonClicked,
    [currentSection, buttonClicked]
  )

  useEffect(() => {
    if (slatsAnimated !== slatAnims.length) return
    useJourneyStore.getState().setSection(JourneySection.Waterfall)
  }, [slatsAnimated, slatAnims])

  return (
    <>
      {/* <ClassicCamera ref={camRef} fov={32.6} /> */}
      <group position={cameraOffset}>
        <WaterfallCamera
          clips={camAnims}
          ref={camRef}
          onAnimEnd={() => setInFrontOfBridge(true)}
        />
      </group>

      <CustomSky />

      <Slats
        slatGroup={slats}
        slatAnims={slatAnims}
        animate={animateSlats}
        onAnimFinished={() => setSlatAnimated((p) => p + 1)}
      />

      <primitive object={mountains} />
      <primitive object={rocks} />
      <primitive object={waterfall} />

      <Waterfall scale={[7, 7, 7]} position={[-5.5, 0, 0]} />

      <ColumnLink
        onColumnClick={() => setButtonClicked(true)}
        show={inFrontOfBridge && !buttonClicked}
      />
    </>
  )
})

export default withScenePortal(WaterfallScene)
