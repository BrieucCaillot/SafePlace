import React, {
  forwardRef,
  RefObject,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useGLTF } from '@react-three/drei'

import useUserStore from '@/stores/useUserStore'
import useAudioStore from '@/stores/useAudioStore'
import useJourneyStore from '@/stores/useJourneyStore'
import useSceneStore from '@/stores/useSceneStore'
import Place from '@/constants/enums/Place'
import Ambiants from '@/constants/enums/Ambiant'
import AudioStatus from '@/constants/enums/Audio'
import { VoiceoverJourney } from '@/constants/enums/Voiceover'
import JourneySection from '@/constants/enums/JourneySection'
import SceneName from '@/constants/enums/SceneName'

import Waterfall from '@/components/canvas/Waterfall/Waterfall'
import WaterfallCamera from '@/components/Journey/Canvas/Scenes/Waterfall/WaterfallCamera'
import withScenePortal from '@/components/common/Scenes/withScenePortal'
import Slats from './Slats'
import CustomSky from '@/components/canvas/Sky/CustomSky'
import ColumnLink from '@/components/Safeplace/Canvas/ColumLocation/ColumnLink/ColumnLink'
import ClassicCamera from '@/components/common/Canvas/ClassicCamera'
import useNonInitialEffect from '@/hooks/useNonInitialEffect'

enum WaterfallSequence {
  ToBridge,
  InFrontOfBridge,
  BridgeBuilding,
  Waterfall,
  Outro,
}

const sequenceVoices: { [key in WaterfallSequence]: VoiceoverJourney } = {
  [WaterfallSequence.ToBridge]: VoiceoverJourney.Bridge,
  [WaterfallSequence.InFrontOfBridge]: null,
  [WaterfallSequence.BridgeBuilding]: null,
  [WaterfallSequence.Waterfall]: VoiceoverJourney.Waterfall,
  [WaterfallSequence.Outro]: VoiceoverJourney.Outro,
}

const sequenceCamIndex: { [key in WaterfallSequence]: number } = {
  [WaterfallSequence.ToBridge]: 0,
  [WaterfallSequence.InFrontOfBridge]: 0,
  [WaterfallSequence.BridgeBuilding]: 0,
  [WaterfallSequence.Waterfall]: 1,
  [WaterfallSequence.Outro]: 2,
}
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

  // State
  const isWaterfallSection = useJourneyStore(
    (s) => s.currentSection === JourneySection.Waterfall
  )
  const isSceneInTransition = useSceneStore((s) => s.inTransition)

  const isThisSceneRendered = useSceneStore(
    (s) => s.renderedScene === SceneName.Waterfall
  )
  const [sequence, setSequence] = useState<WaterfallSequence>(null)

  // ---
  // Update state depending on current sequence
  // ---

  useNonInitialEffect(() => {
    if (!isWaterfallSection || isSceneInTransition) return
    setSequence(WaterfallSequence.ToBridge)
  }, [isWaterfallSection, isSceneInTransition])

  // Reset journey finished when changing section
  useEffect(() => {
    if (isWaterfallSection) return
    const setIsJourneyFinished = useUserStore.getState().setIsJourneyFinished
    setIsJourneyFinished(false)
  }, [isWaterfallSection])

  // Play ambiant
  useEffect(() => {
    if (isThisSceneRendered)
      useAudioStore
        .getState()
        .setCurrentAmbiant(Place.Journey, Ambiants.Waterfall)
  }, [isThisSceneRendered])

  // Play Voice
  useEffect(() => {
    if (!isThisSceneRendered || sequence === null) return
    const { setCurrentVoiceover } = useAudioStore.getState()
    const voice = sequenceVoices[sequence]
    if (voice !== null) setCurrentVoiceover(Place.Journey, voice)
  }, [sequence, isThisSceneRendered])

  // Cam Anim
  const camAnim = useMemo(() => {
    if (!isThisSceneRendered || sequence === null) return null
    return camAnims[sequenceCamIndex[sequence]]
  }, [sequence, isThisSceneRendered])

  // Slat anim
  const slatsAnim = useMemo(
    () =>
      [
        WaterfallSequence.BridgeBuilding,
        WaterfallSequence.Waterfall,
        WaterfallSequence.Outro,
      ].includes(sequence),
    [sequence]
  )

  // ---
  // Update current sequence
  // ---

  useEffect(() => {
    const a = useAudioStore.subscribe(
      (b) => b && setSequence(WaterfallSequence.InFrontOfBridge),
      (s) => s.checkVoiceoverStatus(VoiceoverJourney.Bridge, AudioStatus.Played)
    )
    const b = useAudioStore.subscribe(
      (b) => b && setSequence(WaterfallSequence.Outro),
      (s) =>
        s.checkVoiceoverStatus(VoiceoverJourney.Waterfall, AudioStatus.Played)
    )
    const c = useAudioStore.subscribe(
      (b) => {
        b && useUserStore.getState().setIsJourneyFinished(true)
        useUserStore.getState().setIsJourneyCompleted(true)
      },
      (s) => s.checkVoiceoverStatus(VoiceoverJourney.Outro, AudioStatus.Played)
    )
    return () => [a, b, c].forEach((u) => u())
  }, [])

  return (
    <>
      {/* <ClassicCamera ref={camRef} fov={32.6} /> */}
      <group position={cameraOffset}>
        <WaterfallCamera clip={camAnim} ref={camRef} onAnimEnd={() => {}} />
      </group>

      <CustomSky />

      <Slats
        slatGroup={slats}
        slatAnims={slatAnims}
        animate={slatsAnim}
        onAnimFinished={() => setSequence(WaterfallSequence.Waterfall)}
      />

      <primitive object={mountains} />
      <primitive object={rocks} />
      <primitive object={waterfall} />

      <Waterfall scale={[7, 7, 7]} position={[-5.5, 0, 0]} />

      <ColumnLink
        onColumnClick={() => setSequence(WaterfallSequence.BridgeBuilding)}
        show={sequence === WaterfallSequence.InFrontOfBridge}
      />
    </>
  )
})

export default withScenePortal(WaterfallScene)
