import {
  MutableRefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react'
import { GroupProps, PointerEvent } from 'react-three-fiber'
import { useControls } from 'leva'
import * as THREE from 'three'
import useSavePOIData from '@/hooks/POI/useSavePOIData'
import { SafeplacePOI } from '@/stores/useSafeplaceStore'
import WaterfallFBO from './WaterfallFBO/WaterfallFBO'
import WaterfallParticles from './WaterfallParticles/WaterfallParticles'
import { getPositionTextureFromBox } from '@/utils/FBO/getPositionTexture'
import usePingPong from '@/hooks/FBO/usePingPong'
import useWatchableRef from '@/hooks/useWatchableRef'

const Waterfall = (props: GroupProps) => {
  const bufferSize = useMemo<THREE.Vector2Tuple>(() => [128, 128], [])
  const particlesAmount = bufferSize[0] * bufferSize[1]

  const { showDegug } = useControls(
    'Particles',
    { showDegug: false },
    { collapsed: true }
  )

  const savePOI = useSavePOIData(SafeplacePOI.Waterfall)

  const sceneRef = useRef<THREE.Scene>(new THREE.Scene())
  const cameraRef = useRef<THREE.Camera>(
    new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5)
  )

  const targetMeshRef = useRef<THREE.Mesh>(null)

  const feedbackRef = useRef<THREE.Mesh>(null)
  const particleRef = useRef<THREE.Mesh>(null)

  const quadTexture = useWatchableRef<THREE.Texture | null>(null)
  const particleTexture = useWatchableRef<THREE.Texture | null>(null)
  const initTextureRef = useRef<THREE.Texture>() as MutableRefObject<THREE.Texture>

  const mousePosRef = useWatchableRef<THREE.Vector3>(new THREE.Vector3())

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

  usePingPong(bufferSize, {
    particleTexture,
    quadTexture,
    initTextureRef,
    sceneRef,
    cameraRef,
  })

  const onPointerMove = useCallback<(e: PointerEvent) => void>(
    ({ intersections: [{ point }] }) =>
      (mousePosRef.current = particleRef.current?.worldToLocal(point)),
    []
  )

  return (
    <group {...props}>
      <group visible={showDegug}>
        <mesh scale={[5, 5, 1]} ref={feedbackRef}>
          <planeGeometry />
          <meshBasicMaterial />
        </mesh>
        <mesh
          name='SpawnBox'
          ref={targetMeshRef}
          scale={[5, 0.5, 2]}
          position-y={3}
        >
          <boxBufferGeometry />
          <meshBasicMaterial color={'blue'} wireframe={true} />
        </mesh>
        <mesh name='RaycastPlane' onPointerMove={onPointerMove}>
          <planeGeometry args={[10, 10, 1]} />
          <meshBasicMaterial color={'green'} wireframe={true} />
        </mesh>
      </group>
      <group position-z={6} ref={savePOI} />
      <WaterfallParticles
        positionTexture={particleTexture}
        ref={particleRef}
        numPoints={particlesAmount}
        size={bufferSize}
      />
      <WaterfallFBO
        scene={sceneRef}
        size={bufferSize}
        quadTexture={quadTexture}
        initTexture={initTextureRef}
        mousePosRef={mousePosRef}
      />
    </group>
  )
}

export default Waterfall
