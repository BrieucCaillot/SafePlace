import { useMemo, useRef, useState } from 'react'
import { MeshProps, useFrame, Vector3 } from 'react-three-fiber'
import * as THREE from 'three'
import fragmentShader from './fragmentShader.frag'
import vertexShader from './vertexShader.vert'
import { animated, SpringValue } from 'react-spring/three'
import { useSpring } from 'react-spring'

const Box = (props: MeshProps) => {
  const ref = useRef<THREE.Mesh>(null)

  const [isClicked, setIsClicked] = useState<boolean>(false)

  const springProps = useSpring<Vector3>({
    scale: isClicked ? [2, 2, 2] : [1, 1, 1],
  })

  const uniforms = useRef<{ [name: string]: THREE.IUniform }>({
    uColor: { value: new THREE.Color(0xffff00) },
    uTime: { value: 0 },
  })

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime()
    uniforms.current.uTime.value = time

    if (ref.current === null) return
    ref.current.rotation.x = time / 5
    ref.current.rotation.y = time / 10
  })

  return (
    <animated.mesh
      ref={ref}
      {...props}
      {...springProps}
      onClick={() => setIsClicked(!isClicked)}
    >
      <boxBufferGeometry args={[1, 1, 1]} />
      <rawShaderMaterial
        uniforms={uniforms.current}
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
      />
    </animated.mesh>
  )
}

export default Box
