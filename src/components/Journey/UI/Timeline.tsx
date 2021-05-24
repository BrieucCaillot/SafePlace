import { useCallback, useEffect, useMemo, useRef } from 'react'
import gsap from 'gsap'

import useJourneyStore from '@/stores/useJourneyStore'
import useAudioStore from '@/stores/useAudioStore'
import JourneySection from '@/constants/enums/JourneySection'
import JourneySectionDuration from '@/constants/enums/JourneySectionDuration'

import SVGCheckpoint from '@/components/Journey/UI/SVG/SVGCheckpoint'

const Timeline = () => {
  const currentSection = useJourneyStore((state) => state.currentSection)
  const setCurrentSection = useJourneyStore((state) => state.setSection)

  const timelineProgressRef = useRef<HTMLDivElement>(null)
  const progAnimRef = useRef<GSAPAnimation>()

  const steps = Object.keys(JourneySection)
  const currentIndex = useMemo(
    () => steps.findIndex((s) => s === currentSection),
    [currentSection]
  )

  const onChangingScene = useCallback(() => {
    const { currentAmbiant, currentVoiceover } = useAudioStore.getState()
    currentAmbiant.ambiant.fade(currentAmbiant.ambiant.volume(), 0, 1000)
    currentVoiceover.voiceover.fade(
      currentVoiceover.voiceover.volume(),
      0,
      1000
    )
  }, [])

  const onCheckpointClicked = useCallback((section: JourneySection) => {
    setCurrentSection(section)
    onChangingScene()
  }, [])

  useEffect(() => {
    const progStart = currentIndex / steps.length

    const progNext = (currentIndex + 1) / steps.length
    const duration = Object.values(JourneySectionDuration)[currentIndex]

    progAnimRef.current && progAnimRef.current.kill()

    gsap.set(timelineProgressRef.current, {
      width: `${progStart * 100}%`,
    })

    progAnimRef.current = gsap.to(timelineProgressRef.current, {
      width: `${progNext * 100}%`,
      duration,
      delay: 3,
      onComplete: () => {
        if (currentIndex == steps.length - 1) return
        setCurrentSection(steps[currentIndex + 1] as JourneySection)
        onChangingScene()
      },
    })
  }, [currentSection])

  return (
    <div className='relative flex items-center w-full'>
      <div
        ref={timelineProgressRef}
        className={`absolute top-1/2 transform-gpu -translate-y-1/2 bg-white h-1 rounded-full`}
      ></div>
      {steps.map((s: JourneySection, i, a) => (
        <div key={i} className='relative flex-1 flex items-center'>
          <SVGCheckpoint
            step={i}
            isActive={i <= currentIndex}
            onClick={() => onCheckpointClicked(s)}
          />
          <div className='timeline-bullets bg-repeat-x h-1 w-full rounded-full'></div>
        </div>
      ))}
    </div>
  )
}

export default Timeline
