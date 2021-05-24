import React, {
  forwardRef,
  RefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useThree } from 'react-three-fiber'
import * as THREE from 'three'

import useJourneyStore from '@/stores/useJourneyStore'
import useAudioStore from '@/stores/useAudioStore'
import JourneySection from '@/constants/enums/JourneySection'
import Place from '@/constants/enums/Place'
import Ambiants from '@/constants/enums/Ambiant'
import { VoiceoverJourney } from '@/constants/enums/Voiceover'

import ClassicCamera from '@/components/common/Canvas/ClassicCamera'
import withScenePortal from '@/components/common/Scenes/withScenePortal'
import CustomSky from '@/components/canvas/Sky/CustomSky'
import useSceneStore from '@/stores/useSceneStore'
import useNonInitialEffect from '@/hooks/useNonInitialEffect'

const IntroScene = forwardRef((_, camRef: RefObject<THREE.Camera>) => {
  const [sizeTex, setSizeTex] = useState({ width: 0, height: 0 })

  const introTexture = useMemo(
    () =>
      new THREE.TextureLoader().load('/img/journey/chapter0.jpg', (t) => {
        const { width, height } = t.image
        setSizeTex({ width, height })
      }),
    []
  )

  const planeRef = useRef<THREE.Mesh>()
  const vec3Ref = useMemo(() => new THREE.Vector3(), [])

  const { camera, viewport, size } = useThree()

  useEffect(() => {
    const { width, height } = viewport(
      camera,
      planeRef.current?.getWorldPosition(vec3Ref) as THREE.Vector3
    )

    const texRatio = sizeTex.width / sizeTex.height
    const screenRatio = width / height

    if (texRatio > screenRatio) {
      planeRef.current?.scale.set(height * texRatio, height, 1)
    } else {
      planeRef.current?.scale.set(width, width / texRatio, 1)
    }
  }, [sizeTex, size, camera])

  const isIntroSection = useJourneyStore(
    (s) => s.currentSection === JourneySection.Intro
  )
  const isSceneInTransition = useSceneStore((s) => s.inTransition)

  useNonInitialEffect(() => {
    if (!isIntroSection || isSceneInTransition) return
    const { setCurrentAmbiant, setCurrentVoiceover } = useAudioStore.getState()
    // Ambiant
    setCurrentAmbiant(Place.Journey, Ambiants.Intro)
    // Voiceover
    setCurrentVoiceover(Place.Journey, VoiceoverJourney.Intro)
  }, [isIntroSection, isSceneInTransition])

  return (
    <>
      <ClassicCamera ref={camRef} />
      <CustomSky />
      <mesh ref={planeRef}>
        <planeGeometry />
        <meshBasicMaterial map={introTexture} />
      </mesh>
    </>
  )
})

export default withScenePortal(IntroScene)
