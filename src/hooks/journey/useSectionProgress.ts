import JourneySection from '@/constants/enums/JourneySection'
import JOURNEY_SECTION_SCENES from '@/constants/JOURNEY_SECTION_SCENES'
import useAudioStore from '@/stores/useAudioStore'
import useJourneyStore from '@/stores/useJourneyStore'
import useSceneStore from '@/stores/useSceneStore'
import useUserStore from '@/stores/useUserStore'
import promisifyHowl from '@/utils/promise/promisifyHowl'
import { useCallback, useEffect, useRef } from 'react'
import { useFrame } from 'react-three-fiber'
import useTraceRender from '../debug/useTraceRender'

type DurationElement =
  | number
  | string
  | { actions: Record<string, THREE.AnimationAction>; name: string }
  | boolean

const SECTION_ORDER = [
  JourneySection.Intro,
  JourneySection.Cairns,
  JourneySection.Lake,
  JourneySection.Waterfall,
]

const useSectionProgress = (
  section: JourneySection,
  durationElements: DurationElement[]
) => {
  const onScene = useSceneStore(
    (s) =>
      !s.inTransition && s.renderedScene === JOURNEY_SECTION_SCENES[section]
  )

  const isPaused = useUserStore((s) => s.isPaused)
  const setProgress = useJourneyStore((s) => s.setProgress)

  const audioDurations = useRef<Map<string, Promise<void> | number>>(new Map())

  const storeAudioDuration = useCallback((el: string) => {
    const { initAudio } = useAudioStore.getState()
    if (audioDurations.current.has(el)) return
    audioDurations.current.set(
      el,
      promisifyHowl(initAudio(el), 'load').then(
        () =>
          void (
            audioDurations.current &&
            audioDurations.current.set(el, initAudio(el).duration())
          )
      )
    )
  }, [])

  const processDuration = useCallback(() => {
    let d = 0
    for (const el of durationElements)
      switch (typeof el) {
        case 'number':
          d += el / 1000
          break
        case 'object':
          d += el.actions[el.name].getClip().duration
          break
        case 'string':
          storeAudioDuration(el)
          break
        default:
          break
      }
    return d
  }, [durationElements, storeAudioDuration])

  const duration = useRef(0)

  useEffect(() => {
    duration.current = processDuration()
  })

  useEffect(() => {
    if (!onScene) return
    setProgress(SECTION_ORDER.indexOf(section) / SECTION_ORDER.length)
  }, [onScene])

  useFrame(({}, delta) => {
    if (!onScene || isPaused) return
    let shouldWait = false
    let audioDuration = 0
    for (const el of durationElements) {
      if (typeof el === 'boolean') shouldWait ||= el
      if (typeof el === 'string') {
        const d = audioDurations.current.get(el)
        audioDuration += typeof d === 'number' ? d : 0
      }
    }
    if (shouldWait || audioDuration + duration.current === 0) return
    setProgress((p: number) => {
      return Math.min(
        p + delta / (audioDuration + duration.current) / SECTION_ORDER.length,
        (SECTION_ORDER.indexOf(section) + 1) / SECTION_ORDER.length
      )
    })
  })

  // useTraceRender({
  //   onScene,
  //   isPaused,
  // })
}

export default useSectionProgress
