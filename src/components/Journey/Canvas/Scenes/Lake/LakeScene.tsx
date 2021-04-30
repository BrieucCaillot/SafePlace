import React, { forwardRef, RefObject, useMemo } from 'react'
import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'

import withScenePortal from '@/components/common/Scenes/withScenePortal'
import JourneySky from '@/components/Journey/Canvas/Decorations/JourneySky'
import ClassicCamera from '@/components/common/Canvas/ClassicCamera'

const LakeScene = forwardRef((_, camRef: RefObject<THREE.Camera>) => {
  const gltf = useGLTF('/models/journey/chapter2.glb')

  const camera = useMemo(
    () =>
      gltf.scene.children
        .find((o) => o.type === 'Object3D')
        ?.children.find(
          (o) => o.type === 'PerspectiveCamera'
        ) as THREE.PerspectiveCamera,
    []
  )

  return (
    <group>
      <ClassicCamera
        ref={camRef}
        fov={camera.fov}
        position={camera.getWorldPosition(new THREE.Vector3())}
        quaternion={camera.getWorldQuaternion(new THREE.Quaternion())}
        scale={camera.getWorldScale(new THREE.Vector3())}
      />
      <JourneySky />
      <primitive object={gltf.scene} />
    </group>
  )
})

export default withScenePortal(LakeScene)
