import withScenePortal from '@/components/common/Scenes/withScenePortal'

const MountainScene = () => {
  return (
    <>
      <mesh position-z={-6}>
        <boxGeometry />
        <meshNormalMaterial />
      </mesh>
    </>
  )
}

export default withScenePortal(MountainScene)
