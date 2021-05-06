import { ForwardedRef, forwardRef } from 'react'
import { MeshProps } from 'react-three-fiber'

const MeshShorthand = forwardRef(
  (
    { object, ...props }: MeshProps & { object: THREE.Mesh },
    ref: ForwardedRef<THREE.Mesh>
  ) => {
    return (
      <mesh
        geometry={object.geometry}
        material={object.material}
        position={object.position}
        scale={object.scale}
        rotation={object.rotation}
        {...props}
        ref={ref}
      />
    )
  }
)

export default MeshShorthand
