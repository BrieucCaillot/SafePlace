import * as THREE from 'three'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useThree, Vector3 } from 'react-three-fiber'
import fragmentShader from './fragmentShader.frag'
import vertexShader from './vertexShader.vert'
import HoverCircle from './HoverCircle/HoverCircle'
import { makeButton, useTweaks } from 'use-tweaks'
import MouseFeedback from './MouseFeedback/MouseFeedback'

const ProtoPlane = () => {
  const [loadProgress, setLoadProgress] = useState<number>(0)
  const [progressIndex, setProgressIndex] = useState<number>(0)

  const { scale, ...hoverCircleProps } = useTweaks('HoverCircles', {
    color: '#4F76FE',
    scale: 1,
    ...makeButton('Reset', () => setProgressIndex(0)),
  })

  useEffect(() => {
    console.log(progressIndex)
  }, [progressIndex])

  const { viewport, size } = useThree()

  const uniforms = useRef<{ [name: string]: THREE.IUniform }>({
    uTexture: { value: null },
  })

  const planePositions = useMemo<Vector3[]>(
    () => [
      [-0.5568, -0.1008, 0],
      [0.2408, -0.1358, 0],
      [0.5538, 0.0504, 0],
      [-0.1536, 0.1754, 0],
    ],
    []
  )

  const textures = useMemo<THREE.Texture[]>(() => {
    const loader = new THREE.TextureLoader()

    return new Array(5)
      .fill(0)
      .map((_, i) =>
        loader.load(`textures/4-onboarding-construct-${i + 1}.jpg`, () =>
          setLoadProgress(i)
        )
      )
  }, [])

  const ratio = useMemo(() => {
    return (
      textures[progressIndex].image?.width /
      textures[progressIndex].image?.height
    )
  }, [loadProgress, progressIndex])

  useEffect(() => {
    uniforms.current.uTexture.value = textures[progressIndex]
  }, [progressIndex])

  return (
    <group scale={[viewport.height, viewport.height, viewport.height]}>
      <mesh scale={[ratio, 1, 1]}>
        <planeBufferGeometry args={[1, 1]} />
        <rawShaderMaterial
          uniforms={uniforms.current}
          fragmentShader={fragmentShader}
          vertexShader={vertexShader}
        />
      </mesh>
      {progressIndex < planePositions.length && (
        <HoverCircle
          progressIndex={progressIndex}
          onComplete={() => setProgressIndex(progressIndex + 1)}
          position={planePositions[progressIndex]}
          scale={[scale, scale, scale]}
          {...hoverCircleProps}
        />
      )}
      <MouseFeedback />
    </group>
  )
}

export default ProtoPlane
