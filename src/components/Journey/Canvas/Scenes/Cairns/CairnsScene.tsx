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
import useSceneStore from '@/stores/useSceneStore'
import useNonInitialEffect from '@/hooks/useNonInitialEffect'
import SceneShorthand from '@/components/common/Canvas/SceneShorthand'
import GroupShorthand from '@/components/common/Canvas/GroupShorthand'

const CairnsScene = forwardRef((_, camRef: RefObject<THREE.Camera>) => {
  const isSceneInTransition = useSceneStore((s) => s.inTransition)
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
    // onFinished: () =>
    //   useJourneyStore.getState().setSection(JourneySection.Lake),
  })

  useEffect(() => {
    if (!isCairnSection && animRef.current === null) return
    animRef.current.timeScale = 0.7
  }, [animRef, isCairnSection])

  useFrame(
    () =>
      animRef.current != null &&
      !animRef.current.paused &&
      containerRef.current != null &&
      containerRef.current.updateMatrixWorld()
  )

  useNonInitialEffect(() => {
    if (!isCairnSection || isSceneInTransition) return
    const { setCurrentAmbiant, setCurrentVoiceover } = useAudioStore.getState()
    // Ambiant
    setCurrentAmbiant(Place.Journey, Ambiants.Cairns)
    // Voiceover
    setCurrentVoiceover(Place.Journey, VoiceoverJourney.Cairns)
  }, [isCairnSection, isSceneInTransition])

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
      {/* <primitive object={scene} /> */}

      <SceneShorthand object={scene} />

      <GroupShorthand object={scene.children.find((o) => o.name === 'ground')}>
        <GroupShorthand object={groundMesh}>
          <GrassParams
            targetMeshRef={groundMeshRef}
            folderName={'cairn_greenery'}
            controlsName={'grass'}
            route={Routes.Journey}
            grassParams={{
              weightAttribute: 'grassWeight',
              amount: 24576,
              windAmplitude: 0.007,
              size: 0.04,
            }}
            position={new THREE.Vector3(0, 0.223, 0).add(groundMesh.position)}
            shadowTexture={shadowTex}
          />
          <FlowersParams
            targetMeshRef={groundMeshRef}
            folderName={'cairn_greenery'}
            controlsName={'flowers'}
            route={Routes.Journey}
            flowersParams={{
              weightAttribute: 'flowerWeight1',
              amount: 1024,
              size: 0.3,
            }}
            position={new THREE.Vector3(0, 0.18, 0).add(groundMesh.position)}
            shadowTexture={shadowTex}
          />
        </GroupShorthand>
      </GroupShorthand>
    </>
  )
})

export default withScenePortal(CairnsScene)
