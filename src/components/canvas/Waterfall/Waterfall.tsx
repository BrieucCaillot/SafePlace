import { useFBO } from '@react-three/drei'
import { useEffect, useMemo, useRef } from 'react'
import { GroupProps, useFrame, useThree } from 'react-three-fiber'
import * as THREE from 'three'
import useSavePOIData from '@/hooks/POI/useSavePOIData'
import { SafeplacePOI } from '@/stores/useSafeplaceStore'
import WaterfallFBO from './WaterfallFBO/WaterfallFBO'
import WaterfallParticles from './WaterfallParticles/WaterfallParticles'
import { getPositionTextureFromBox } from '@/utils/FBO/getPositionTexture'

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

  let fbo1 = useFBO(bufferSize[0], bufferSize[1], {
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    type: THREE.FloatType,
    stencilBuffer: false,
  })
  let fbo2 = useMemo(() => fbo1.clone(), [])

  const { gl } = useThree()

  useEffect(() => {
    cameraRef.current.position.setZ(6)

    if (!targetMeshRef.current?.geometry) return
    targetMeshRef.current.geometry.computeBoundingBox()
    targetMeshRef.current.updateMatrix()
    const boundingBox = targetMeshRef.current.geometry.boundingBox?.clone()
    boundingBox?.applyMatrix4(targetMeshRef.current.matrix)

    const initDataTexture = getPositionTextureFromBox(
      bufferSize,
      boundingBox as THREE.Box3
    )

    ;((quadRef.current as THREE.Mesh)
      .material as THREE.ShaderMaterial).uniforms.uTexture.value = initDataTexture

    gl.setRenderTarget(fbo1)
    gl.render(sceneRef.current, cameraRef.current)

    gl.setRenderTarget(fbo2)
    gl.render(sceneRef.current, cameraRef.current)
  }, [])

  useFrame(({ gl }) => {
    let oldFbo1 = fbo1 // store A, the penultimate state
    fbo1 = fbo2 // advance A to the updated state
    fbo2 = oldFbo1
    ;((quadRef.current as THREE.Mesh)
      .material as THREE.ShaderMaterial).uniforms.uTexture.value = fbo1.texture

    gl.setRenderTarget(fbo2)
    gl.render(sceneRef.current, cameraRef.current)
    // pass the new positional values to the scene users see
    ;(feedbackRef.current?.material as THREE.MeshBasicMaterial).map =
      fbo2.texture
    ;((particleRef.current as THREE.Mesh)
      .material as THREE.ShaderMaterial).uniforms.uTexture.value = fbo2.texture

    gl.setRenderTarget(null)
  }, 1)

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
