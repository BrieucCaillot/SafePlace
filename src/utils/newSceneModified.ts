import * as THREE from 'three'

const newSceneModified = ({ fog = null }: { fog?: THREE.FogExp2 }) => {
  const scene = new THREE.Scene()
  if (fog !== null) scene.fog = fog

  return scene
}

export default newSceneModified
