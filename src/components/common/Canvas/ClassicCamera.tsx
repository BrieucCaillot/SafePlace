import { forwardRef, MutableRefObject } from 'react'
import { PerspectiveCameraProps } from 'react-three-fiber'
import * as THREE from 'three'

const ClassicCamera = forwardRef(
  (
    props: PerspectiveCameraProps,
    fowardedRef: MutableRefObject<THREE.Camera>
  ) => {
    return (
      <perspectiveCamera
        position-z={6}
        ref={fowardedRef}
        near={0.1}
        far={1000}
        fov={75}
        {...props}
      />
    )
  }
)

export default ClassicCamera
