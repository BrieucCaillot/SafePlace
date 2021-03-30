import { useFBO } from '@react-three/drei'
import { useEffect, useMemo, useRef } from 'react'
import { GroupProps, useFrame, useThree } from 'react-three-fiber'
import * as THREE from 'three'
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler'
import useSavePOIData from '@/hooks/POI/useSavePOIData'
import { SafeplacePOI } from '@/stores/useSafeplaceStore'
import WaterfallFBO from './WaterfallFBO/WaterfallFBO'
import WaterfallParticles from './WaterfallParticles/WaterfallParticles'

function getRandomData(
  width: number,
  height: number,
  size: number
): Float32Array {
  var len = width * height * 4
  var data = new Float32Array(len)
  while (len--) data[len] = (Math.random() * 2 - 1) * size
  return data
}

function getGeometryData(mesh: THREE.Mesh | null, n: number): Float32Array {
  if (mesh === null) throw 'No mesh'
  const data = new Float32Array(n * 4)
  const sampler = new MeshSurfaceSampler(mesh).build()
  const position = new THREE.Vector3()
  for (let index = 0; index < n; index++) {
    sampler.sample(position)
    data[index * 4 + 0] = position.x
    data[index * 4 + 1] = position.y
    data[index * 4 + 2] = position.z
    data[index * 4 + 3] = 0
  }
  return data
}

const Waterfall = (props: GroupProps) => {
  const bufferSize = useMemo<THREE.Vector2Tuple>(() => [100, 100], [])

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

    const data = getGeometryData(
      targetMeshRef.current,
      bufferSize[0] * bufferSize[1]
    )
    const initDataTexture = new THREE.DataTexture(
      data,
      bufferSize[0],
      bufferSize[1],
      THREE.RGBAFormat,
      THREE.FloatType
    )
    initDataTexture.needsUpdate = true
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
      <group>
        <mesh ref={targetMeshRef}>
          <torusKnotBufferGeometry />
          <meshNormalMaterial visible={true} />
        </mesh>
        <WaterfallParticles
          ref={particleRef}
          numPoints={10000}
          size={bufferSize}
        />
      </group>
    </group>
  )
}

export default Waterfall
