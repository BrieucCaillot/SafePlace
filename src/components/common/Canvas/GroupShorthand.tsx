import { ForwardedRef, forwardRef } from 'react'
import { GroupProps } from 'react-three-fiber'

const GroupShorthand = forwardRef(
  (
    { object, children, ...props }: GroupProps & { object: THREE.Object3D },
    ref: ForwardedRef<THREE.Object3D>
  ) => {
    return (
      <group
        position={object.position}
        scale={object.scale}
        rotation={object.rotation}
        {...props}
        ref={ref}
      >
        {children}
      </group>
    )
  }
)

export default GroupShorthand
