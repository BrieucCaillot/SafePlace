import React, {
  ComponentType,
  forwardRef,
  PropsWithoutRef,
  ReactElement,
  RefObject,
} from 'react'
import { createPortal } from 'react-three-fiber'

export interface WithScenePortalProps {
  scene: THREE.Scene
}

const withScenePortal = <P extends PropsWithoutRef<object>>(
  Component: ComponentType<P>
) => {
  return React.memo(
    forwardRef(
      (props: P & WithScenePortalProps, ref: RefObject<THREE.Camera>) =>
        createPortal(
          <Component {...props} ref={ref} />,
          props.scene
        ) as ReactElement<P & WithScenePortalProps>
    )
  )
}

export default withScenePortal
