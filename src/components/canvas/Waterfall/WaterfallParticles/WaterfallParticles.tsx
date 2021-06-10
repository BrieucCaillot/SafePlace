import useColorUniform from '@/hooks/uniforms/useColorUniform'
import useNumberUniform from '@/hooks/uniforms/useNumberUniform'
import useWatchableUniform from '@/hooks/uniforms/useWatchableUniform'
import { WatchableRefObject } from '@/hooks/useWatchableRef'
import { folder, useControls } from 'leva'
import { forwardRef, RefObject, useMemo, useRef } from 'react'
import { PointsProps, useThree } from 'react-three-fiber'
import * as THREE from 'three'
import fragmentShader from './WaterfallParticles.fs'
import vertexShader from './WaterfallParticles.vs'

const WaterfallParticles = forwardRef(
  (
    {
      positionTexture,
      size: bufferSize,
      numPoints,
      ...meshProps
    }: {
      positionTexture: WatchableRefObject<THREE.Texture>
      size: THREE.Vector2Tuple
      numPoints: number
    } & PointsProps,
    ref: RefObject<THREE.Mesh>
  ) => {
    const {
      particlesSize,
      sizeVariation,
      alpha,
      startColor,
      endColor,
      colorFactor: foamColorFactor,
      size: foamSize,
      color: foamColor,
    } = useControls(
      'waterfall.particles',
      {
        aspect: folder(
          {
            particlesSize: 300,
            sizeVariation: 0.7,
            alpha: { value: 1, min: 0, max: 1 },
            startColor: '#a3b0d5',
            endColor: '#184162',
          },
          { collapsed: true }
        ),
        foam: folder(
          {
            colorFactor: { value: 0.8, min: 0, max: 1 },
            size: 3.5,
            color: '#ffffff',
          },
          { collapsed: true }
        ),
      },
      { collapsed: true }
    )

    // const [matcap] = useMatcapTexture('1B1B1B_999999_575757_747474', 64)
    // const normalMap = useMemo(
    //   () => new THREE.TextureLoader().load('img/journey/normalMap.png'),
    //   []
    // )

    const { gl } = useThree()

    const uniforms = useRef<Record<string, THREE.IUniform>>({
      ...THREE.UniformsLib['fog'],
      uPosTexture: { value: null },
      uSize: { value: 0 },
      uSizeVariation: { value: 0 },
      uAlpha: { value: 0 },
      uStartColor: { value: new THREE.Color() },
      uEndColor: { value: new THREE.Color() },
      uFoamColorFactor: { value: 0 },
      uFoamSize: { value: 0 },
      uFoamColor: { value: new THREE.Color() },
    })

    useNumberUniform(uniforms.current.uSize, particlesSize * gl.getPixelRatio())
    useNumberUniform(uniforms.current.uSizeVariation, sizeVariation)
    useNumberUniform(uniforms.current.uAlpha, alpha)
    useNumberUniform(uniforms.current.uFoamColorFactor, foamColorFactor)
    useNumberUniform(uniforms.current.uFoamSize, foamSize)
    useColorUniform(uniforms.current.uFoamColor, foamColor)
    useColorUniform(uniforms.current.uStartColor, startColor)
    useColorUniform(uniforms.current.uEndColor, endColor)
    useWatchableUniform(uniforms.current.uPosTexture, positionTexture)

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
      <points
        {...meshProps}
        geometry={bufferGeometry}
        ref={ref}
        frustumCulled={false}
      >
        <shaderMaterial
          transparent={true}
          fragmentShader={fragmentShader}
          vertexShader={vertexShader}
          uniforms={uniforms.current}
          fog={true}
        />
      </points>
    )
  }
)

export default WaterfallParticles
