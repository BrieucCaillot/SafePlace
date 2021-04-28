import { useGLTF } from '@react-three/drei'

const WaterfallModel = () => {
  const gltf = useGLTF('/models/journey/chapter3.glb')

  return <primitive object={gltf.scene} />
}

export default WaterfallModel
