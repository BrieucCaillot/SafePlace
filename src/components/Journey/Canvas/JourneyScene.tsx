import withScenePortal from '@/components/common/Scenes/withScenePortal'
import JourneySky from '@/components/Journey/Canvas/Decorations/JourneySky'
import JourneyChapter3Model from '@/components/Journey/Canvas/JourneyChapter3Model'

const MountainScene = () => {
  return (
    <>
      <JourneySky />

      <JourneyChapter3Model />
    </>
  )
}

export default withScenePortal(MountainScene)
