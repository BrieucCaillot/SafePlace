import SafeplacePOI from './enums/SafeplacePOI'

const POI_AVAILABILITY: Record<SafeplacePOI, SafeplacePOI[]> = {
  [SafeplacePOI.OnBoarding]: [],
  [SafeplacePOI.Outside]: [SafeplacePOI.Inside],
  [SafeplacePOI.Resources]: [SafeplacePOI.Inside, SafeplacePOI.ResourceFocused],
  [SafeplacePOI.ResourceFocused]: [SafeplacePOI.Resources],
  [SafeplacePOI.Inside]: [
    SafeplacePOI.Resources,
    SafeplacePOI.MountainColumn,
    // SafeplacePOI.PlaceholderColumn1,
    // SafeplacePOI.PlaceholderColumn2,
    // SafeplacePOI.PlaceholderColumn3,
    // SafeplacePOI.PlaceholderColumn4,
  ],
  [SafeplacePOI.MountainColumn]: [],
  [SafeplacePOI.PlaceholderColumn1]: [],
  [SafeplacePOI.PlaceholderColumn2]: [],
  [SafeplacePOI.PlaceholderColumn3]: [],
  [SafeplacePOI.PlaceholderColumn4]: [],
}

export default POI_AVAILABILITY
