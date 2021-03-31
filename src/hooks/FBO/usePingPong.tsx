import { useFBO } from '@react-three/drei'
import { MutableRefObject, RefObject, useEffect, useMemo } from 'react'
import { useFrame, useThree } from 'react-three-fiber'
import * as THREE from 'three'

const usePingPong = (
  bufferSize: THREE.Vector2Tuple,
  {
    cameraRef,
    sceneRef,
    setQuadTexture,
    setParticlesTexture,
    initTextureRef,
  }: {
    cameraRef: RefObject<THREE.Camera>
    sceneRef: RefObject<THREE.Scene>
    initTextureRef: MutableRefObject<THREE.Texture>
    setQuadTexture: (tex: THREE.Texture | null) => void
    setParticlesTexture: (tex: THREE.Texture | null) => void
  }
) => {
  let fbo1 = useFBO(bufferSize[0], bufferSize[1], {
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    type: THREE.FloatType,
    stencilBuffer: false,
  })
  let fbo2 = useMemo(() => fbo1.clone(), [])

  const { gl } = useThree()

  useEffect(() => {
    if (sceneRef.current === null) throw 'No scene'
    if (cameraRef.current === null) throw 'No camera'
    setQuadTexture(initTextureRef.current)

    gl.setRenderTarget(fbo1)
    gl.render(sceneRef.current, cameraRef.current)

    gl.setRenderTarget(fbo2)
    gl.render(sceneRef.current, cameraRef.current)
  }, [])

  useFrame(({ gl }) => {
    if (sceneRef.current === null) return
    if (cameraRef.current === null) return
    let oldFbo1 = fbo1 // store A, the penultimate state
    fbo1 = fbo2 // advance A to the updated state
    fbo2 = oldFbo1
    setQuadTexture(fbo1.texture)

    gl.setRenderTarget(fbo2)
    gl.render(sceneRef.current, cameraRef.current)
    // pass the new positional values to the scene users see

    gl.setRenderTarget(null)
    setParticlesTexture(fbo2.texture)
  }, 1)
}

export default usePingPong
