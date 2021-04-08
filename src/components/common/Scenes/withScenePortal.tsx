import { Component, ComponentType, FC, ReactNode, RefObject } from 'react'
import { createPortal } from 'react-three-fiber'
import LayoutCanvas from '../LayoutCanvas'

export interface WithScenePortalProps {
  scene: THREE.Scene
}

const withScenePortal = <P extends object>(Component: ComponentType<P>) => {
  return ((props: P & WithScenePortalProps) =>
    createPortal(<Component {...props} />, props.scene)) as FC<
    P & WithScenePortalProps
  >
}

export default withScenePortal
