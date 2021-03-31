import useNumberUniform from '@/hooks/uniforms/useNumberUniform'
import { useControls } from 'leva'
import { forwardRef, RefObject, useEffect, useMemo, useRef } from 'react'
import { MeshProps, useFrame } from 'react-three-fiber'
import * as THREE from 'three'
import fragmentShader from './WaterfallParticles.fs'
import vertexShader from './WaterfallParticles.vs'

const WaterfallParticles = forwardRef(
  (
    {
      size: bufferSize,
      numPoints,
      ...meshProps
    }: {
      size: THREE.Vector2Tuple
      numPoints: number
    } & MeshProps,
    ref: RefObject<THREE.Mesh>
  ) => {
    const { particlesSize, scale, alpha } = useControls(
      'Particles',
      {
        particlesSize: 0.04,
        scale: 1,
        alpha: { value: 1, min: 0, max: 1 },
      },
      { collapsed: true }
    )

    const uniforms = useRef<Record<string, THREE.IUniform>>({
      uOrigPosTexture: { value: null },
      uSize: { value: 0 },
      uAlpha: { value: 0 },
    })
    useNumberUniform(uniforms.current.uSize, particlesSize)
    useNumberUniform(uniforms.current.uAlpha, alpha)

    const bufferGeometry = useMemo(() => {
      const geometry = new THREE.InstancedBufferGeometry()

      // positions
      const positions = new THREE.BufferAttribute(new Float32Array(4 * 3), 3)
      positions.setXYZ(0, -0.5, 0.5, 0.0)
      positions.setXYZ(1, 0.5, 0.5, 0.0)
      positions.setXYZ(2, -0.5, -0.5, 0.0)
      positions.setXYZ(3, 0.5, -0.5, 0.0)
      geometry.setAttribute('position', positions)

      // uvs
      const uvs = new THREE.BufferAttribute(new Float32Array(4 * 2), 2)
      uvs.setXY(0, 0.0, 0.0)
      uvs.setXY(1, 1.0, 0.0)
      uvs.setXY(2, 0.0, 1.0)
      uvs.setXY(3, 1.0, 1.0)
      geometry.setAttribute('uv', uvs)

      // index
      geometry.setIndex(
        new THREE.BufferAttribute(new Uint16Array([0, 2, 1, 2, 3, 1]), 1)
      )

      const offsets = new Float32Array(numPoints * 3)
      for (let i = 0; i < numPoints; i++) {
        offsets[i * 3 + 0] = (Math.random() - 0.5) * 2 * 10
        offsets[i * 3 + 1] = (Math.random() - 0.5) * 2 * 10
        offsets[i * 3 + 2] = (Math.random() - 0.5) * 2 * 10
      }
      geometry.setAttribute(
        'aOffset',
        new THREE.InstancedBufferAttribute(offsets, 3, false)
      )

      const pixelPos = new Float32Array(numPoints * 2)
      for (let i = 0; i < numPoints; i++) {
        pixelPos[i * 2] = (i % bufferSize[0]) / bufferSize[0]
        pixelPos[i * 2 + 1] = Math.floor(i / bufferSize[0]) / bufferSize[1]
      }
      geometry.setAttribute(
        'aPixelPosition',
        new THREE.InstancedBufferAttribute(pixelPos, 2, false)
      )

      return geometry
    }, [numPoints, bufferSize[0], bufferSize[1]])

    return (
      <mesh
        {...meshProps}
        geometry={bufferGeometry}
        ref={ref}
        scale={[scale, scale, scale]}
      >
        <shaderMaterial
          transparent={true}
          fragmentShader={fragmentShader}
          vertexShader={vertexShader}
          uniforms={uniforms.current}
        />
      </mesh>
    )
  }
)

export default WaterfallParticles
