import React, { forwardRef, RefObject, useEffect, useMemo, useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import mergeRefs from 'react-merge-refs'
import * as THREE from 'three'
import { useControls } from 'leva'

import useSceneStore from '@/stores/useSceneStore'

import SceneName from '@/constants/enums/SceneName'
import Routes from '@/constants/enums/Routes'

import useMouseRotation from '@/hooks/animation/useMouseRotation'
import useSceneControls from '@/hooks/three/useSceneControls'

import Waterfall from '@/components/canvas/Waterfall/Waterfall'
import withScenePortal from '@/components/common/Scenes/withScenePortal'
import CustomSky from '@/components/canvas/Sky/CustomSky'
import SceneShorthand from '@/components/common/Canvas/SceneShorthand'
import Slats from '../Waterfall/Slats'

const WaterfallStandalone = forwardRef((_, camRef: RefObject<THREE.Camera>) => {
  // REFS
  const gltf = useGLTF('/models/journey/chapter3.glb')

  const { orbitControls } = useControls({ orbitControls: false })

  const [slats, rocks, waterfall, background] = useMemo(
    () =>
      ['slats', 'rocks', 'waterfall', 'cameras', 'background'].map((n) =>
        gltf.scene.children.find((o) => o.name.includes(n))
      ),
    []
  )

  const slatAnims = useMemo(
    () => gltf.animations.filter((a) => a.name.includes('slat')),
    []
  )

  const localCamRef = useRef<THREE.PerspectiveCamera>()
  const slatRef = useRef<{
    play: () => Promise<void>
    getGroup: () => RefObject<THREE.Group>
    instantPlay: () => void
  }>()

  // --- STATE
  const onScene = useSceneStore(
    (s) =>
      s.nextScene === SceneName.WaterfallStandalone ||
      s.renderedScene === SceneName.WaterfallStandalone
  )
  useSceneControls(SceneName.WaterfallStandalone, Routes.Journey)

  useEffect(() => {
    slatRef.current.instantPlay()
    const ground = waterfall.children[1] as THREE.Mesh
    ;(ground.material as THREE.MeshBasicMaterial).vertexColors = false
  }, [])

  useMouseRotation(localCamRef, {
    amplitude: 0.02,
    easing: 0.01,
    enable: onScene && !orbitControls,
  })

  return (
    <>
      <perspectiveCamera
        ref={mergeRefs([camRef, localCamRef])}
        position={[-4.945663889012466, 11, 38.69802448079922]}
        rotation={[
          0.04605382204413411,
          0.029589921697151165,
          -0.0013634933986878357,
        ]}
        near={0.1}
        far={1000}
        fov={32.4}
      />

      <CustomSky />

      <SceneShorthand object={background} />
      <SceneShorthand object={rocks} />
      <SceneShorthand object={waterfall} />

      <Waterfall position-y={0} slats={slatRef} />

      <Slats group={slats} anims={slatAnims} ref={slatRef} />
    </>
  )
})

export default withScenePortal(WaterfallStandalone)
