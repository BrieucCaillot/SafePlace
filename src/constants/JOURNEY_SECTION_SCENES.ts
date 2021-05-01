import JourneySection from './enums/JourneySection'
import SceneName from './enums/SceneName'

const JOURNEY_SECTION_SCENES: { [key in JourneySection]: SceneName } = {
  [JourneySection.Intro]: SceneName.JourneyIntro,
  [JourneySection.Cairns]: SceneName.Cairns,
  [JourneySection.Lake]: SceneName.Lake,
  [JourneySection.ToBridge]: SceneName.Waterfall,
  [JourneySection.Bridge]: SceneName.Waterfall,
  [JourneySection.Waterfall]: SceneName.Waterfall,
  [JourneySection.Outro]: SceneName.Waterfall,
}

export default JOURNEY_SECTION_SCENES
