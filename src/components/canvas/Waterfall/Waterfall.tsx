import { RefObject, useEffect, useMemo, useRef } from 'react'
import { GroupProps } from 'react-three-fiber'
import * as THREE from 'three'
import { useControls } from 'leva'

import WaterfallFBO from './WaterfallFBO/WaterfallFBO'
import WaterfallParticles from './WaterfallParticles/WaterfallParticles'
import { getPositionTextureFromBox } from '@/utils/FBO/getPositionTexture'
import usePingPong from '@/hooks/FBO/usePingPong'
import useWatchableRef from '@/hooks/useWatchableRef'
import findMinimumTexSize from '@/utils/FBO/findMinimumTexSize'
import useSceneStore from '@/stores/useSceneStore'
import SceneName from '@/constants/enums/SceneName'
import Routes from '@/constants/enums/Routes'
import { useGLTF } from '@react-three/drei'
import MeshShorthand from '@/components/common/Canvas/MeshShorthand'
import useWaterfallCursor from './useWaterfallCursor'

const Waterfall = ({
  slats,
  ...props
}: GroupProps & {
  slats: RefObject<{ getGroup: () => RefObject<THREE.Group> }>
}) => {
  const { showDegug, numPoints, cursorEase } = useControls(
    'waterfall.particles',
    {
      showDegug: false,
      numPoints: {
        value: 16368 * 8,
        step: 1,
        label: 'Particle amount',
      },
      cursorEase: {
        value: 0.1,
        min: 0,
        max: 1,
      },
    },
    {
      collapsed: true,
      render: (s) =>
        s('path') === Routes.Journey || s('path') === Routes.Waterfall,
    }
  )

  const { nodes } = useGLTF('/models/journey/waterfall_sdf.glb')

  const bufferSize = useMemo<THREE.Vector2Tuple>(
    () => findMinimumTexSize(numPoints),
    [numPoints]
  )

  const isSceneRendered = useSceneStore(
    (s) =>
      s.renderedScene === SceneName.Waterfall ||
      s.nextScene === SceneName.Waterfall ||
      s.renderedScene === SceneName.WaterfallStandalone ||
      s.nextScene === SceneName.WaterfallStandalone
  )

  const sceneRef = useRef<THREE.Scene>(new THREE.Scene())
  const cameraRef = useRef<THREE.Camera>(
    new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5)
  )

  const feedbackRef = useRef<THREE.Mesh>(null)
  const particleRef = useRef<THREE.Mesh>(null)
  const raycastPlane = useRef<THREE.Mesh>(null)

  const quadTexture = useWatchableRef<THREE.Texture | null>(null)
  const particleTexture = useWatchableRef<THREE.Texture | null>(null)
  const initTextureRef = useWatchableRef<THREE.Texture | null>(null)

  useEffect(
    () =>
      showDegug
        ? particleTexture.onChange((t) => {
            if (t && feedbackRef.current)
              (feedbackRef.current?.material as THREE.MeshBasicMaterial).map = t
          })
        : null,
    [showDegug]
  )

  useEffect(() => {
    cameraRef.current.position.setZ(6)

    const targetMesh = nodes['spawn'] as THREE.Mesh

    if (!targetMesh.geometry) return
    const geom = targetMesh.geometry
    geom.computeBoundingBox()
    targetMesh.updateMatrix()
    const boundingBox = geom.boundingBox.clone()
    boundingBox?.applyMatrix4(targetMesh.matrix)

    initTextureRef.current = getPositionTextureFromBox(
      bufferSize,
      boundingBox as THREE.Box3
    )
  }, [])

  usePingPong(bufferSize, {
    particleTexture,
    quadTexture,
    initTextureRef,
    sceneRef,
    cameraRef,
    enable: isSceneRendered,
  })

  const { doesIntersect, smoothedRayMouseRef } = useWaterfallCursor({
    particleRef,
    raycastPlane,
    cursorEase,
    enable: isSceneRendered,
  })

  return (
    <group {...props}>
      <group visible={showDegug}>
        <mesh scale={[5, 5, 1]} ref={feedbackRef} visible={false}>
          <planeGeometry />
          <meshBasicMaterial />
        </mesh>
        <MeshShorthand
          name='RaycastPlane'
          ref={raycastPlane}
          object={nodes['raycast'] as THREE.Mesh}
        >
          <meshBasicMaterial
            color={'green'}
            wireframe={false}
            depthTest={true}
          />
        </MeshShorthand>
      </group>

      <WaterfallParticles
        positionTexture={particleTexture}
        ref={particleRef}
        numPoints={numPoints}
        size={bufferSize}
      />
      <WaterfallFBO
        scene={sceneRef}
        quadTexture={quadTexture}
        initTexture={initTextureRef}
        mousePosRef={smoothedRayMouseRef}
        doesIntersect={doesIntersect}
        sdfScene={nodes['sdf']}
        slats={slats}
      />
    </group>
  )
}

export default Waterfall
