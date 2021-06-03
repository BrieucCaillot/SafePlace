import {
  MutableRefObject,
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react'
import { GroupProps, PointerEvent, useFrame } from 'react-three-fiber'
import * as THREE from 'three'
import { useControls } from 'leva'

import useSavePOIData from '@/hooks/POI/useSavePOIData'
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

const Waterfall = ({
  slats,
  ...props
}: GroupProps & {
  slats: RefObject<{ getGroup: () => RefObject<THREE.Group> }>
}) => {
  const { showDegug, numPoints } = useControls(
    'particles',
    {
      showDegug: false,
      numPoints: {
        value: 16368 * 8,
        step: 1,
        label: 'Particle amount',
      },
    },
    {
      collapsed: true,
      render: (s) => s('path') === Routes.Journey,
    }
  )

  const { nodes } = useGLTF('/models/journey/waterfall_sdf.glb')

  const bufferSize = useMemo<THREE.Vector2Tuple>(
    () => findMinimumTexSize(numPoints),
    [numPoints]
  )

  const isSceneRendered = useSceneStore(
    (s) => s.renderedScene === SceneName.Waterfall
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

  const windowMouseRef = useRef<THREE.Vector2>(new THREE.Vector2())
  const doesIntersectRef = useWatchableRef<boolean>(false)
  const raycastedMouseRef = useWatchableRef<THREE.Vector3>(
    new THREE.Vector3(-10, -10, -10)
  )

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

  useEffect(() => {
    if (!isSceneRendered) return
    const handleMouse = (e: MouseEvent) => {
      windowMouseRef.current.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1
      )
    }
    window.addEventListener('mousemove', handleMouse)
    return () => window.removeEventListener('mousemove', handleMouse)
  }, [isSceneRendered])

  useFrame(({ camera, raycaster }) => {
    if (!isSceneRendered) return
    raycaster.setFromCamera(windowMouseRef.current, camera)
    const intersections = raycaster.intersectObject(raycastPlane.current)

    const newDoesIntersect = intersections.length > 0
    if (newDoesIntersect !== doesIntersectRef.current)
      doesIntersectRef.current = newDoesIntersect

    if (newDoesIntersect)
      raycastedMouseRef.current = particleRef.current?.worldToLocal(
        intersections[0].point
      )
  })
  usePingPong(bufferSize, {
    particleTexture,
    quadTexture,
    initTextureRef,
    sceneRef,
    cameraRef,
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
        mousePosRef={raycastedMouseRef}
        doesIntersectRef={doesIntersectRef}
        sdfScene={nodes['sdf']}
        slats={slats}
      />
    </group>
  )
}

export default Waterfall
