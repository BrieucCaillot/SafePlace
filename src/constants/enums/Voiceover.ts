export enum VoiceoverSafeplace {
  Outside = 'Outside',
  OnBoarding = 'OnBoarding',
  Inside = 'Inside',
  MountainColumn = 'MountainColumn',
}

export enum VoiceoverJourney {
  One = 'One',
}

export enum VoiceoverStatus {
  Processing = 'Processing',
  Playing = 'Playing',
  Played = 'Played',
}

export default { VoiceoverSafeplace, VoiceoverJourney, VoiceoverStatus }
