import {
  MutableRefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react'
import { GroupProps, PointerEvent } from 'react-three-fiber'
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

const Waterfall = (props: GroupProps) => {
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

  const bufferSize = useMemo<THREE.Vector2Tuple>(
    () => findMinimumTexSize(numPoints),
    [numPoints]
  )

  const sceneRef = useRef<THREE.Scene>(new THREE.Scene())
  const cameraRef = useRef<THREE.Camera>(
    new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5)
  )

  const targetMeshRef = useRef<THREE.Mesh>(null)
  const cubeRef = useRef<THREE.Mesh>(null)

  const feedbackRef = useRef<THREE.Mesh>(null)
  const particleRef = useRef<THREE.Mesh>(null)

  const quadTexture = useWatchableRef<THREE.Texture | null>(null)
  const particleTexture = useWatchableRef<THREE.Texture | null>(null)
  const initTextureRef = useWatchableRef<THREE.Texture | null>(null)

  const mousePosRef = useWatchableRef<THREE.Vector3>(
    new THREE.Vector3(-10, -10, -10)
  )

  useEffect(
    () =>
      particleTexture.onChange((t) => {
        if (t && feedbackRef.current)
          (feedbackRef.current?.material as THREE.MeshBasicMaterial).map = t
      }),
    []
  )

  useEffect(() => {
    cameraRef.current.position.setZ(6)

    if (!targetMeshRef.current?.geometry) return
    targetMeshRef.current.geometry.computeBoundingBox()
    targetMeshRef.current.updateMatrix()
    const boundingBox = targetMeshRef.current.geometry.boundingBox?.clone()
    boundingBox?.applyMatrix4(targetMeshRef.current.matrix)

    initTextureRef.current = getPositionTextureFromBox(
      bufferSize,
      boundingBox as THREE.Box3
    )
  }, [])

  useEffect(
    () =>
      mousePosRef.onChange((v) => {
        if (cubeRef.current == null) return
        cubeRef.current.position.copy(v)
      }),
    []
  )

  const isSceneRendered = useSceneStore(
    (s) => s.renderedScene === SceneName.Waterfall
  )
  usePingPong(bufferSize, {
    particleTexture,
    quadTexture,
    initTextureRef,
    sceneRef,
    cameraRef,
    enable: isSceneRendered,
  })

  const onPointerMove = useCallback<(e: PointerEvent) => void>(({ point }) => {
    mousePosRef.current = particleRef.current?.worldToLocal(point)
  }, [])

  return (
    <group {...props}>
      <group visible={showDegug}>
        <mesh scale={[5, 5, 1]} ref={feedbackRef} visible={false}>
          <planeGeometry />
          <meshBasicMaterial />
        </mesh>
        <mesh
          name='SpawnBox'
          ref={targetMeshRef}
          scale={[4, 0.3, 0.3]}
          position={[0, 3.25, -0.95]}
        >
          <boxBufferGeometry />
          <meshBasicMaterial color={'blue'} wireframe={true} />
        </mesh>
        <mesh
          name='RaycastPlane'
          onPointerMove={onPointerMove}
          position-z={-0.85}
          rotation-x={-0.1}
          position-y={1.8}
        >
          <planeGeometry args={[3.8, 2.3, 1]} />
          <meshBasicMaterial
            color={'green'}
            wireframe={false}
            depthTest={true}
          />
        </mesh>
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
        mousePosRef={mousePosRef}
      />
    </group>
  )
}

export default Waterfall
