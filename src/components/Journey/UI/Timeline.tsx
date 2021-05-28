import { useCallback, useEffect, useMemo, useRef } from 'react'
import gsap from 'gsap'
import Easing from 'easing-functions'

import useJourneyStore from '@/stores/useJourneyStore'
import JourneySection from '@/constants/enums/JourneySection'
import JourneySectionDuration from '@/constants/enums/JourneySectionDuration'

import SVGCheckpoint from '@/components/Journey/UI/SVG/SVGCheckpoint'

const Timeline = () => {
  const currentSection = useJourneyStore((state) => state.currentSection)
  const setCurrentSection = useJourneyStore((state) => state.setSection)

  const timelineProgressRef = useRef<HTMLDivElement>(null)

  const steps = Object.keys(JourneySection) as JourneySection[]

  const currentIndex = useMemo(
    () => steps.findIndex((s) => s === currentSection),
    [currentSection]
  )

  const onCheckpointClicked = useCallback((section: JourneySection) => {
    setCurrentSection(section)
  }, [])

  useEffect(() => {
    const prog = currentIndex / steps.length

    // const duration = Object.values(JourneySectionDuration)[currentIndex]

    const anim = gsap.to(timelineProgressRef.current, {
      width: `${prog * 100}%`,
      duration: 1,
    })

    return () => {
      anim.kill()
    }
  }, [currentSection])

  return (
    <div className='relative flex items-center w-full'>
      <div
        ref={timelineProgressRef}
        className={`absolute top-1/2 transform-gpu -translate-y-1/2 bg-white h-1 rounded-full`}
      />
      {steps.map((s: JourneySection, i) => (
        <div key={i} className='relative flex-1 flex items-center'>
          <SVGCheckpoint
            step={i}
            isActive={i <= currentIndex}
            onClick={() => onCheckpointClicked(s)}
          />
          <div className='timeline-bullets bg-repeat-x h-1 w-full rounded-full' />
        </div>
      ))}
    </div>
  )
}

export default Timeline
