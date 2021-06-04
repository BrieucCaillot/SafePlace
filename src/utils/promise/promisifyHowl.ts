import { Howl } from 'howler'

type HowlEvents =
  | 'play'
  | 'end'
  | 'pause'
  | 'stop'
  | 'mute'
  | 'volume'
  | 'rate'
  | 'seek'
  | 'fade'
  | 'unlock'
  | 'load'
  | 'loaderror'
  | 'playerror'

const promisifyHowl = (howl: Howl, event: HowlEvents) =>
  new Promise<void>((res) => howl.on(event, () => res()))

export default promisifyHowl
