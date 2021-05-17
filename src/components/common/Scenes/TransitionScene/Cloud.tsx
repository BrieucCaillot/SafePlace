import { WatchableRefObject } from '@/hooks/useWatchableRef'
import { useEffect, useMemo, useRef } from 'react'
import { SpriteProps, useFrame } from 'react-three-fiber'
import * as THREE from 'three'

const Cloud = ({
  texture,
  startPos,
  endPos,
  prog,
  ...props
}: {
  texture: THREE.Texture
  startPos: THREE.Vector3Tuple
  endPos: THREE.Vector3Tuple
  prog: WatchableRefObject<number>
} & Omit<SpriteProps, 'position' | 'rotation'>) => {
  const ref = useRef<THREE.Sprite>(null)

  const v1 = useMemo(() => new THREE.Vector3(...startPos), startPos)
  const v2 = useMemo(() => new THREE.Vector3(...endPos), endPos)

  useEffect(
    () =>
      prog.onChange(
        (v) => ref.current && ref.current.position.lerpVectors(v1, v2, v)
      ),
    [prog, v1, v2]
  )

  useFrame(() => ref.current && (ref.current.material.rotation += 0.005))

  return (
    <sprite {...props} ref={ref}>
      <spriteMaterial map={texture} />
    </sprite>
  )
}

export default Cloud
