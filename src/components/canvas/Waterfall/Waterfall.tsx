import {
  MutableRefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react'
import { GroupProps, PointerEvent } from 'react-three-fiber'
import * as THREE from 'three'
import useSavePOIData from '@/hooks/POI/useSavePOIData'
import { SafeplacePOI } from '@/stores/useSafeplaceStore'
import WaterfallFBO from './WaterfallFBO/WaterfallFBO'
import WaterfallParticles from './WaterfallParticles/WaterfallParticles'
import { getPositionTextureFromBox } from '@/utils/FBO/getPositionTexture'
import usePingPong from '@/hooks/FBO/usePingPong'
import { useControls } from 'leva'
import { useMatcapTexture } from '@react-three/drei'

const Waterfall = (props: GroupProps) => {
  const bufferSize = useMemo<THREE.Vector2Tuple>(() => [128, 128], [])
  const particlesAmount = bufferSize[0] * bufferSize[1]

  const { showDegug } = useControls(
    'Particles',
    { showDegug: false },
    { collapsed: true }
  )

  const sceneRef = useRef<THREE.Scene>(new THREE.Scene())
  const cameraRef = useRef<THREE.Camera>(
    new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5)
  )
  const targetMeshRef = useRef<THREE.Mesh>(null)

  const feedbackRef = useRef<THREE.Mesh>(null)
  const particleRef = useRef<THREE.Mesh>(null)
  const quadRef = useRef<THREE.Mesh>(null)

  const setQuadTexture = useCallback((texture: THREE.Texture | null) => {
    if (quadRef.current === null) return
    ;((quadRef.current as THREE.Mesh)
      .material as THREE.ShaderMaterial).uniforms.uPosTexture.value = texture
  }, [])

  const setParticlesTexture = useCallback((texture: THREE.Texture | null) => {
    if (particleRef.current === null) return
    ;(feedbackRef.current?.material as THREE.MeshBasicMaterial).map = texture
    ;((particleRef.current as THREE.Mesh)
      .material as THREE.ShaderMaterial).uniforms.uPosTexture.value = texture
  }, [])

  const initTextureRef = useRef<THREE.Texture>() as MutableRefObject<THREE.Texture>

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
    ;((quadRef.current as THREE.Mesh)
      .material as THREE.ShaderMaterial).uniforms.uOrigPosTexture.value =
      initTextureRef.current
  }, [])

  usePingPong(bufferSize, {
    setParticlesTexture,
    setQuadTexture,
    initTextureRef,
    sceneRef,
    cameraRef,
  })

  const savePOI = useSavePOIData(SafeplacePOI.Waterfall)

  const onPointerMove = useCallback<(e: PointerEvent) => void>(
    ({ intersections: [{ point }] }) => {
      ;((quadRef.current as THREE.Mesh)
        .material as THREE.ShaderMaterial).uniforms.uMousePos.value.copy(
        particleRef.current?.worldToLocal(point)
      )
    },
    []
  )

  return (
    <group {...props}>
      <mesh scale={[5, 5, 1]} ref={feedbackRef} visible={showDegug}>
        <planeGeometry />
        <meshBasicMaterial />
      </mesh>
      <group position-z={6} ref={savePOI} />
      <WaterfallFBO ref={quadRef} scene={sceneRef} size={bufferSize} />
      <group position-z={1}>
        <mesh
          name='SpawnBox'
          ref={targetMeshRef}
          scale={[5, 0.5, 2]}
          position-y={3}
          visible={showDegug}
        >
          <boxBufferGeometry />
          <meshBasicMaterial color={'blue'} wireframe={true} />
        </mesh>
        <mesh
          visible={showDegug}
          name='RaycastPlane'
          onPointerMove={onPointerMove}
        >
          <planeGeometry args={[10, 10, 1]} />
          <meshBasicMaterial color={'green'} wireframe={true} />
        </mesh>
        <WaterfallParticles
          ref={particleRef}
          numPoints={particlesAmount}
          size={bufferSize}
        />
      </group>
    </group>
  )
}

export default Waterfall
