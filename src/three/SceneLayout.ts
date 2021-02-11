import CallbackObject from './Abstract/CallbackObject'
import Scene from './Scene'
import * as THREE from 'three'

export default function SceneLayout(): Scene {
  const scene = new Scene(document.querySelector('canvas') as HTMLCanvasElement)

  scene.AddSeveral([
    new CallbackObject(() => new THREE.Mesh(new THREE.BoxBufferGeometry(), new THREE.MeshNormalMaterial()), [
      (object3d: THREE.Object3D) => {
        object3d.rotateX(0.01)
        object3d.rotateY(0.01)
      },
    ]),
  ])

  return scene
}
