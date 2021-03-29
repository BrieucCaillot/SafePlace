import useNumberUniform from '@/hooks/uniforms/useNumberUniform'
import { forwardRef, RefObject, useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import fragmentShader from './fragmentShader.frag'
import vertexShader from './vertexShader.vert'

const WaterfallParticles = forwardRef(
  (
    {
      size,
      numPoints,
    }: {
      size: THREE.Vector2Tuple
      numPoints: number
    },
    ref: RefObject<THREE.Mesh>
  ) => {
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
        pixelPos[i * 2] = (i % size[0]) / size[0]
        pixelPos[i * 2 + 1] = Math.floor(i / size[0]) / size[1]
      }
      geometry.setAttribute(
        'aPixelPosition',
        new THREE.InstancedBufferAttribute(pixelPos, 2, false)
      )

      return geometry
    }, [numPoints, size[0], size[1]])

    const uniforms = useRef<Record<string, THREE.IUniform>>({
      uTexture: { value: null },
      uSize: { value: 0 },
      uAmplitude: { value: 0 },
    })
    useNumberUniform(uniforms.current.uSize, 0.1)
    useNumberUniform(uniforms.current.uAmplitude, 2)

    return (
      <mesh
        geometry={bufferGeometry}
        position-z={2}
        scale={[1, 1, 1]}
        ref={ref}
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
