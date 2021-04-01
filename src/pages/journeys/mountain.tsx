import dynamic from 'next/dynamic'
import JourneyCamera from '@/components/canvas/Camera/JourneyCamera'
import JourneyUI from '@/components/Journeys/JourneyUI'

const MountainScene = dynamic(
  () => import('@/components/Journeys/Mountain/MountainScene'),
  {
    ssr: false,
  }
)

const MountainJourney = () => {
  return (
    <>
      <JourneyCamera r3f />
      <MountainScene r3f />
      <JourneyUI />
    </>
  )
}

export default MountainJourney
