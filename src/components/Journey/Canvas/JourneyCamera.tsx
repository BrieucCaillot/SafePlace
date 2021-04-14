import { forwardRef, MutableRefObject } from 'react'
import * as THREE from 'three'

const JourneyCamera = forwardRef(
  (_, fowardedRef: MutableRefObject<THREE.Camera>) => {
    return (
      <perspectiveCamera
        position-z={6}
        name={'Journey Cam'}
        ref={fowardedRef}
        near={0.1}
        far={1000}
        fov={75}
      />
    )
  }
)

export default JourneyCamera
