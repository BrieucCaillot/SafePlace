import useSavePOIData from '@/hooks/POI/useSavePOIData'
import { SafeplacePOI } from '@/stores/useSafeplaceStore'
import { useFBO } from '@react-three/drei'
import { useEffect, useMemo, useRef } from 'react'
import { GroupProps, useFrame, useThree } from 'react-three-fiber'
import * as THREE from 'three'
import WaterfallFBO from './WaterfallFBO/WaterfallFBO'
import WaterfallParticles from './WaterfallParticles/WaterfallParticles'

function getRandomData(width, height, size) {
  var len = width * height * 4
  var data = new Float32Array(len)
  while (len--) data[len] = (Math.random() * 2 - 1) * size
  return data
}

const Waterfall = (props: GroupProps) => {
  const bufferSize = useMemo(() => [100, 100], [])

  const sceneRef = useRef<THREE.Scene>(new THREE.Scene())
  const cameraRef = useRef<THREE.Camera>(
    new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5)
  )

  const feedbackRef = useRef<THREE.Mesh>(null)
  const particleRef = useRef<THREE.Mesh>(null)
  const quadRef = useRef<THREE.Mesh>(null)

  let fbo1 = useFBO(100, 100, {
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    type: THREE.FloatType,
    stencilBuffer: false,
  })
  let fbo2 = useMemo(() => fbo1.clone(), [])

  const { gl } = useThree()

  useEffect(() => {
    cameraRef.current.position.setZ(6)

    const data = getRandomData(bufferSize[0], bufferSize[1], 1)
    const dataTex = new THREE.DataTexture(
      data,
      bufferSize[0],
      bufferSize[1],
      THREE.RGBAFormat,
      THREE.FloatType
    )
    dataTex.needsUpdate = true
    ;((quadRef.current as THREE.Mesh)
      .material as THREE.ShaderMaterial).uniforms.uTexture.value = dataTex

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
      <WaterfallFBO ref={quadRef} scene={sceneRef} />
      <WaterfallParticles
        ref={particleRef}
        numPoints={10000}
        size={[100, 100]}
      />
    </group>
  )
}

export default Waterfall
