import {
  MutableRefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react'
import { GroupProps } from 'react-three-fiber'
import * as THREE from 'three'
import useSavePOIData from '@/hooks/POI/useSavePOIData'
import { SafeplacePOI } from '@/stores/useSafeplaceStore'
import WaterfallFBO from './WaterfallFBO/WaterfallFBO'
import WaterfallParticles from './WaterfallParticles/WaterfallParticles'
import { getPositionTextureFromBox } from '@/utils/FBO/getPositionTexture'
import usePingPong from '@/hooks/FBO/usePingPong'

const Waterfall = (props: GroupProps) => {
  const bufferSize = useMemo<THREE.Vector2Tuple>(() => [100, 100], [])
  const particlesAmount = bufferSize[0] * bufferSize[1]

  const sceneRef = useRef<THREE.Scene>(new THREE.Scene())
  const cameraRef = useRef<THREE.Camera>(
    new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5)
  )
  const targetMeshRef = useRef<THREE.Mesh>(null)

  const feedbackRef = useRef<THREE.Mesh>(null)
  const particleRef = useRef<THREE.Mesh>(null)
  const quadRef = useRef<THREE.Mesh>(null)

  const setQuadTexture = useCallback((texture: THREE.Texture | null) => {
    ;((quadRef.current as THREE.Mesh)
      .material as THREE.ShaderMaterial).uniforms.uTexture.value = texture
  }, [])

  const setParticlesTexture = useCallback((texture: THREE.Texture | null) => {
    ;(feedbackRef.current?.material as THREE.MeshBasicMaterial).map = texture
    ;((particleRef.current as THREE.Mesh)
      .material as THREE.ShaderMaterial).uniforms.uOrigPosTexture.value = texture
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
  }, [])

  usePingPong(bufferSize, {
    setParticlesTexture,
    setQuadTexture,
    initTextureRef,
    sceneRef,
    cameraRef,
  })

  const savePOI = useSavePOIData(SafeplacePOI.Waterfall)

  return (
    <group {...props}>
      <mesh scale={[5, 5, 1]} ref={feedbackRef}>
        <planeGeometry />
        <meshBasicMaterial />
      </mesh>
      <group position-z={6} ref={savePOI} />
      <WaterfallFBO ref={quadRef} scene={sceneRef} size={bufferSize} />
      <group position-z={1}>
        <mesh
          ref={targetMeshRef}
          scale={[5, 0.5, 2]}
          position-y={2}
          visible={true}
        >
          <boxBufferGeometry />
          <meshBasicMaterial color={'blue'} wireframe={true} />
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
