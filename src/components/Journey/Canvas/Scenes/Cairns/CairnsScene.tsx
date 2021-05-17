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
import CustomSky from '@/components/canvas/Sky/CustomSky'
import prepareAttributeForSample from '@/utils/geometry/prepareAttributesForSample'
import GrassParams from '@/components/Safeplace/Canvas/Decorations/Grass/GrassParams'
import FlowersParams from '@/components/Safeplace/Canvas/Decorations/Flowers/FlowerParams'
import Routes from '@/constants/enums/Routes'

const CairnsScene = forwardRef((_, camRef: RefObject<THREE.Camera>) => {
  const isCairnSection = useJourneyStore(
    (s) => s.currentSection === JourneySection.Cairns
  )

  const {
    scene,
    animations: [camAnim],
    nodes,
  } = useGLTF('/models/journey/chapter1.glb')
  const shadowTex = useMemo(() => {
    const t = new THREE.TextureLoader().load('/img/journey/shadow_chap1.png')
    t.flipY = false
    return t
  }, [])

  const groundMesh = useMemo(() => {
    const m = nodes['ground_mesh'] as THREE.Mesh
    prepareAttributeForSample(m.geometry)
    ;(m.material as THREE.MeshBasicMaterial).vertexColors = false
    return m
  }, [])
  const groundMeshRef = useRef<THREE.Mesh>(groundMesh)

  const cameraGroup = useMemo(() => scene.getObjectByName('camera'), [])
  const containerRef = useRef<THREE.Group>()
  const animRef = useThreeAnimation({
    clip: isCairnSection ? camAnim : null,
    ref: containerRef,
    onFinished: () =>
      useJourneyStore.getState().setSection(JourneySection.Lake),
  })

  useFrame(
    () =>
      animRef.current != null &&
      !animRef.current.paused &&
      containerRef.current != null &&
      containerRef.current.updateMatrixWorld()
  )

  useEffect(() => {
    if (!isCairnSection) return
    const { setCurrentAmbiant, setCurrentVoiceover } = useAudioStore.getState()
    // Ambiant
    setCurrentAmbiant(Place.Journey, Ambiants.Cairns)
    // Voiceover
    setCurrentVoiceover(Place.Journey, VoiceoverJourney.Cairns)
  }, [isCairnSection])

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
      <CustomSky />
      <primitive object={scene} />
      <GrassParams
        targetMeshRef={groundMeshRef}
        folderName={'cairn_greenery'}
        controlsName={'grass'}
        route={Routes.Journey}
        grassParams={{ weightAttribute: 'grassWeight', amount: 24576 }}
        position={new THREE.Vector3(0, 0.4, 0).add(groundMesh.position)}
        shadowTexture={shadowTex}
      />
      <FlowersParams
        targetMeshRef={groundMeshRef}
        folderName={'cairn_greenery'}
        controlsName={'flowers'}
        route={Routes.Journey}
        flowersParams={{ weightAttribute: 'flowerWeight1', amount: 1024 }}
        position={groundMesh.position}
        shadowTexture={shadowTex}
      />
    </>
  )
})

export default withScenePortal(CairnsScene)
