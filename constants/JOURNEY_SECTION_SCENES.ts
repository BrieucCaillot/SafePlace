import JourneySection from './enums/JourneySection'
import SceneName from './enums/SceneName'

const JOURNEY_SECTION_SCENES = {
  [JourneySection.Intro]: SceneName.JourneyIntro,
  [JourneySection.Cairns]: SceneName.Cairns,
  [JourneySection.Lake]: SceneName.Lake,
  [JourneySection.Bridge]: SceneName.Waterfall,
  [JourneySection.Waterfall]: SceneName.Waterfall,
  [JourneySection.Outro]: SceneName.Waterfall,
}

export default JOURNEY_SECTION_SCENES
