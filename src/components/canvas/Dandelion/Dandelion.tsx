import * as THREE from 'three'
import { useControls } from 'leva'
import { useEffect, useMemo, useRef } from 'react'
import { GroupProps, useThree } from 'react-three-fiber'
import fragmentShader from './Dandelion.fs'
import vertexShader from './Dandelion.vs'
import useSavePOIData from '@/hooks/POI/useSavePOIData'
import useColorUniform from '@/hooks/uniforms/useColorUniform'
import useNumberUniform from '@/hooks/uniforms/useNumberUniform'
import { SafeplacePOI } from '@/stores/useSafeplaceStore'
import findMinimumTexSize from '@/utils/FBO/findMinimumTexSize'
import { getPositionTextureFromMesh } from '@/utils/FBO/getPositionTexture'

const Dandelion = (props: GroupProps) => {
  const savePOI = useSavePOIData(SafeplacePOI.Dandelion)

  const numPoints = 16
  const bufferSize = useMemo(() => findMinimumTexSize(numPoints), [numPoints])

  const meshRef = useRef<THREE.Mesh>(null)

  const {
    particlesSize,
    sizeVariation,
    alpha,
    startColor,
    endColor,
  } = useControls(
    'dandelion',
    {
      particlesSize: 90,
      sizeVariation: 1,
      alpha: { value: 1, min: 0, max: 1 },
      startColor: '#3e69e8',
      endColor: '#18275f',
    },
    { collapsed: true }
  )

  const { gl } = useThree()

  const uniforms = useRef<Record<string, THREE.IUniform>>({
    uPosTexture: { value: null },
    uSize: { value: 0 },
    uSizeVariation: { value: 0 },
    uAlpha: { value: 0 },
    uStartColor: { value: new THREE.Color() },
    uEndColor: { value: new THREE.Color() },
  })

  useNumberUniform(uniforms.current.uSize, particlesSize * gl.getPixelRatio())
  useNumberUniform(uniforms.current.uSizeVariation, sizeVariation)
  useNumberUniform(uniforms.current.uAlpha, alpha)
  useColorUniform(uniforms.current.uStartColor, startColor)
  useColorUniform(uniforms.current.uEndColor, endColor)
  useEffect(() => {
    if (meshRef.current === null) return
    uniforms.current.uPosTexture.value = getPositionTextureFromMesh(
      meshRef.current,
      bufferSize,
      numPoints
    )
  }, [bufferSize[0], bufferSize[1], numPoints])

  const bufferGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry()

    // positions
    const positions = new THREE.BufferAttribute(
      new Float32Array(numPoints * 3).fill(0),
      3
    )
    geometry.setAttribute('position', positions)

    const pixelPos = new Float32Array(numPoints * 2)
    for (let i = 0; i < numPoints; i++) {
      pixelPos[i * 2] = (i % bufferSize[0]) / bufferSize[0]
      pixelPos[i * 2 + 1] = Math.floor(i / bufferSize[0]) / bufferSize[1]
    }
    geometry.setAttribute(
      'aPixelPosition',
      new THREE.BufferAttribute(pixelPos, 2, false)
    )

    return geometry
  }, [numPoints, bufferSize[0], bufferSize[1]])

  return (
    <group {...props}>
      <group position-z={6} ref={savePOI} />
      <mesh ref={meshRef} visible={false}>
        <icosahedronGeometry args={[0.05, 2]} />
        <meshBasicMaterial color='red' wireframe={true} />
      </mesh>
      <points geometry={bufferGeometry}>
        <shaderMaterial
          transparent={true}
          uniforms={uniforms.current}
          fragmentShader={fragmentShader}
          vertexShader={vertexShader}
        />
      </points>
    </group>
  )
}

export default Dandelion
