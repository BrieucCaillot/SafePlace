import { RefObject, useMemo } from 'react'
import { useThree } from 'react-three-fiber'
import * as THREE from 'three'

const useFitObjectToCamera = (
  targetRef: RefObject<THREE.Object3D>,
  targetRatio: number
) => {
  const vec3Ref = useMemo(() => new THREE.Vector3(), [])

  const { camera, viewport, size } = useThree()

  const scale = useMemo<THREE.Vector3Tuple>(() => {
    const { width, height } = viewport(
      camera,
      targetRef.current?.getWorldPosition(vec3Ref) as THREE.Vector3
    )
    const screenRatio = width / height

    return targetRatio > screenRatio
      ? [height * targetRatio, height, 1]
      : [width, width / targetRatio, 1]
  }, [targetRatio, size, camera])

  return scale
}

export default useFitObjectToCamera
