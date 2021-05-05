import JourneySection from './enums/JourneySection'
import SceneName from './enums/SceneName'

const JOURNEY_SECTION_SCENES: { [key in JourneySection]: SceneName } = {
  [JourneySection.Intro]: SceneName.JourneyIntro,
  [JourneySection.Cairns]: SceneName.Cairns,
  [JourneySection.Lake]: SceneName.Lake,
  [JourneySection.Waterfall]: SceneName.Waterfall,
}

export default JOURNEY_SECTION_SCENES
