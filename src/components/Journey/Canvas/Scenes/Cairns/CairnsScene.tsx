import React, { forwardRef, RefObject, useMemo } from 'react'
import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'

import ClassicCamera from '@/components/common/Canvas/ClassicCamera'
import withScenePortal from '@/components/common/Scenes/withScenePortal'
import JourneySky from '@/components/Journey/Canvas/Decorations/JourneySky'

const CairnsScene = forwardRef((_, camRef: RefObject<THREE.Camera>) => {
  const gltf = useGLTF('/models/journey/chapter1.glb')

  const camera = useMemo(
    () =>
      gltf.scene.children.find((obj) => obj.name.includes('camera')).children[0]
        .children[0] as THREE.PerspectiveCamera,
    []
  )

  console.log(camera)

  return (
    <>
      <ClassicCamera
        ref={camRef}
        fov={camera.fov}
        position={camera.getWorldPosition(new THREE.Vector3())}
        quaternion={camera.getWorldQuaternion(new THREE.Quaternion())}
        scale={camera.getWorldScale(new THREE.Vector3())}
      />
      <JourneySky />
      <primitive object={gltf.scene} />
      {/* <mesh>
        <coneGeometry />
        <meshNormalMaterial />
      </mesh> */}
    </>
  )
})

export default withScenePortal(CairnsScene)
