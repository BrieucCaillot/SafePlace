import withScenePortal from '@/components/common/Scenes/withScenePortal'
import JourneySky from '@/components/Journey/Canvas/Decorations/JourneySky'
import React from 'react'
import JourneyChapter3Model from '../../JourneyChapter3Model'

const WaterfallScene = () => {
  return (
    <>
      <JourneySky />
      <JourneyChapter3Model />
    </>
  )
}

export default withScenePortal(WaterfallScene)
