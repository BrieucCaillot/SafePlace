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
    } = useControls(
      'particles',
      {
        'Particle Params': folder(
          {
            particlesSize: 4,
            sizeVariation: 1,
            alpha: { value: 1, min: 0, max: 1 },
            startColor: '#3e69e8',
            endColor: '#18275f',
          },
          { collapsed: true }
        ),
      },
      { collapsed: true }
    )

    // const [matcap] = useMatcapTexture('1B1B1B_999999_575757_747474', 64)
    // const normalMap = useMemo(
    //   () => new THREE.TextureLoader().load('img/normalMap.png'),
    //   []
    // )

    const { gl } = useThree()

    const uniforms = useRef<Record<string, THREE.IUniform>>({
      uPosTexture: { value: null },
      uSize: { value: 0 },
      uSizeVariation: { value: 0 },
      uAlpha: { value: 0 },
      uStartColor: { value: new THREE.Color() },
      uEndColor: { value: new THREE.Color() },
      // uMatcap: { value: null },
      // uNormalMap: { value: null },
    })

    useNumberUniform(uniforms.current.uSize, particlesSize * gl.getPixelRatio())
    useNumberUniform(uniforms.current.uSizeVariation, sizeVariation)
    useNumberUniform(uniforms.current.uAlpha, alpha)
    useColorUniform(uniforms.current.uStartColor, startColor)
    useColorUniform(uniforms.current.uEndColor, endColor)
    useWatchableUniform(uniforms.current.uPosTexture, positionTexture)
    // useEffect(() => {
    //   uniforms.current.uMatcap.value = matcap
    // }, [matcap])
    // useEffect(() => {
    //   uniforms.current.uNormalMap.value = normalMap
    // }, [normalMap])

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
        />
      </points>
    )
  }
)

export default WaterfallParticles
