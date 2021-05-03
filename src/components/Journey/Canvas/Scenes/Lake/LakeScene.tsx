import React, { forwardRef, RefObject, useEffect, useMemo, useRef } from 'react'
import { useFrame } from 'react-three-fiber'
import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'

import useJourneyStore from '@/stores/useJourneyStore'
import useAudioStore from '@/stores/useAudioStore'
import useThreeAnimation from '@/hooks/animation/useThreeAnimation'
import JourneySection from '@/constants/enums/JourneySection'
import Place from '@/constants/enums/Place'
import Ambiants from '@/constants/enums/Ambiant'
import { VoiceoverJourney } from '@/constants/enums/Voiceover'

import withScenePortal from '@/components/common/Scenes/withScenePortal'
import ClassicCamera from '@/components/common/Canvas/ClassicCamera'
import Dandelion from '@/components/canvas/Dandelion/Dandelion'
import CustomSky from '@/components/canvas/Sky/CustomSky'

const LakeScene = forwardRef((_, camRef: RefObject<THREE.Camera>) => {
  const {
    scene,
    animations: [camAnim],
  } = useGLTF('/models/journey/chapter2.glb')

  const containerRef = useRef<THREE.Group>()
  const isLakeSection = useJourneyStore(
    (s) => s.currentSection === JourneySection.Lake
  )
  const setSection = useJourneyStore((s) => s.setSection)

  const [
    camGroup,
    ground,
    lake,
    trees,
    dandelion,
    rocks,
    _1,
    _2,
    _3,
    particules,
  ] = useMemo(() => [...scene.children], [])

  const camera = useMemo(
    () => camGroup.children[0] as THREE.PerspectiveCamera,
    []
  )

  const animRef = useThreeAnimation({
    // clip: isLakeSection ? camAnim : null,
    clip: null,
    ref: containerRef,
    onFinished: () => setSection(JourneySection.Lake),
  })

  useFrame(
    () =>
      animRef.current != null &&
      !animRef.current.paused &&
      containerRef.current != null &&
      containerRef.current.updateMatrixWorld()
  )

  const dandelionPoints = useMemo(
    () => particules.children.map((o) => o.position),
    []
  )

  const setCurrentAmbiant = useAudioStore((s) => s.setCurrentAmbiant)
  const setCurrentVoiceover = useAudioStore((s) => s.setCurrentVoiceover)

  useEffect(() => {
    if (!isLakeSection) return
    // Ambiant
    setCurrentAmbiant(Place.Journey, Ambiants.Lake)
    // Voiceover
    setCurrentVoiceover(Place.Journey, VoiceoverJourney.Lake1)
  }, [isLakeSection])

  return (
    <>
      <ClassicCamera
        ref={camRef}
        position={camera.getWorldPosition(new THREE.Vector3())}
        quaternion={camera.getWorldQuaternion(new THREE.Quaternion())}
        fov={camera.fov}
      />
      <group ref={containerRef}>
        <ClassicCamera
          // ref={camRef}
          fov={camera.fov}
          rotation-x={-Math.PI / 2}
          position={[0, 0, 0]}
        />
        {/* <mesh>
          <boxBufferGeometry />
          <meshNormalMaterial />
        </mesh> */}
      </group>
      <CustomSky />
      <Dandelion points={dandelionPoints} position={particules.position} />
      <primitive object={ground} />
      <primitive object={lake} />
      <primitive object={trees} />
      <primitive object={dandelion} />
      <primitive object={rocks} />
    </>
  )
})

export default withScenePortal(LakeScene)
