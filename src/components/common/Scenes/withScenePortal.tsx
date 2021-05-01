import {
  Component,
  ComponentType,
  FC,
  forwardRef,
  PropsWithoutRef,
  ReactElement,
  ReactNode,
  RefObject,
} from 'react'
import { createPortal } from 'react-three-fiber'
import LayoutCanvas from '../LayoutCanvas'

export interface WithScenePortalProps {
  scene: THREE.Scene
}

const withScenePortal = <P extends PropsWithoutRef<object>>(
  Component: ComponentType<P>
) => {
  return forwardRef(
    (props: P & WithScenePortalProps, ref: RefObject<THREE.Camera>) =>
      createPortal(
        <Component {...props} ref={ref} />,
        props.scene
      ) as ReactElement<P & WithScenePortalProps>
  )
}

export default withScenePortal
