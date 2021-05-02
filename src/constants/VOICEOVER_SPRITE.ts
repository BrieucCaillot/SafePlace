import InstructionsList from './enums/InstructionsList'
import { VoiceoverJourney, VoiceoverSafeplace } from './enums/Voiceover'

const VOICEOVER_SPRITE: {
  [key in VoiceoverSafeplace | InstructionsList | VoiceoverJourney]: [
    number,
    number
  ]
} = {
  [VoiceoverSafeplace.Arrived]: [0, 7608.004535147393],
  [InstructionsList.Instruction1]: [9000, 6768.004535147393],
  [InstructionsList.Instruction2]: [17000, 4152.018140589568],
  [InstructionsList.Instruction3]: [23000, 7800.000000000001],
  [VoiceoverSafeplace.OnBoarding]: [32000, 5904.013605442174],
  [VoiceoverSafeplace.Inside]: [39000, 13175.986394557825],
  [VoiceoverSafeplace.MountainColumn]: [54000, 6480.000000000004],
  [VoiceoverJourney.Intro]: [62000, 16104.013605442176],
  [VoiceoverJourney.Cairns]: [80000, 15695.98639455782],
  [VoiceoverJourney.Lake1]: [97000, 17352.018140589564],
  [VoiceoverJourney.Lake2]: [116000, 9360],
  [VoiceoverJourney.Bridge]: [127000, 27695.98639455782],
  [VoiceoverJourney.Waterfall]: [156000, 18840.000000000004],
  [VoiceoverJourney.Outro]: [176000, 10944.013605442165],
}

export default VOICEOVER_SPRITE
