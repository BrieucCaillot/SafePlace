import { ForwardedRef, forwardRef } from 'react'
import { GroupProps, MeshProps } from 'react-three-fiber'
import GroupShorthand from './GroupShorthand'
import MeshShorthand from './MeshShorthand'

const SceneShorthand = forwardRef(
  (
    { object, ...props }: GroupProps & { object: THREE.Object3D },
    ref: ForwardedRef<THREE.Object3D>
  ) => {
    switch (object.type) {
      case 'Group':
      case 'Object3D':
        return (
          <GroupShorthand {...props} ref={ref} object={object as THREE.Group}>
            {object.children.map((o) => (
              <SceneShorthand object={o} key={o.uuid} />
            ))}
          </GroupShorthand>
        )

      case 'Mesh':
        return (
          <MeshShorthand
            {...((props as unknown) as MeshProps)}
            ref={ref as ForwardedRef<THREE.Mesh>}
            object={object as THREE.Mesh}
          />
        )
      default:
        return null
    }
  }
)

export default SceneShorthand
