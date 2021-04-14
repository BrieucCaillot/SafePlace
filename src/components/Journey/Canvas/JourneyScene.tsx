import withScenePortal from '@/components/common/Scenes/withScenePortal'

const MountainScene = () => {
  return (
    <>
      <mesh>
        <boxGeometry />
        <meshNormalMaterial />
      </mesh>
    </>
  )
}

export default withScenePortal(MountainScene)
