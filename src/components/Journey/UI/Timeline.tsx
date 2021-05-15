import { useEffect, useMemo, useRef } from 'react'
import gsap from 'gsap'

import useJourneyStore from '@/stores/useJourneyStore'
import JourneySection from '@/constants/enums/JourneySection'
import SVGCheckpoint from './SVG/SVGCheckpoint'

const Timeline = () => {
  const currentSection = useJourneyStore((state) => state.currentSection)
  const setCurrentSection = useJourneyStore((state) => state.setSection)

  const timelineProgressRef = useRef<HTMLDivElement>(null)

  const steps = [
    JourneySection.Intro,
    JourneySection.Cairns,
    JourneySection.Lake,
    JourneySection.Waterfall,
  ]

  const currentIndex = useMemo(
    () =>
      steps.findIndex((s) =>
        Array.isArray(s) ? s.includes(currentSection) : s === currentSection
      ),
    [currentSection]
  )

  useEffect(() => {
    const prog = currentIndex / (steps.length - 1)

    gsap.to(timelineProgressRef.current, {
      width: `${prog * 100}%`,
      duration: 1,
    })
  }, [currentSection])

  return (
    <div className='relative flex items-center w-full'>
      <div
        ref={timelineProgressRef}
        className={`absolute top-1/2 transform-gpu -translate-y-1/2 bg-white h-1 rounded-full`}
      ></div>
      {steps.map((s, i, a) => (
        <div
          key={i}
          className={
            i === a.length - 1
              ? 'absolute -right-3.5'
              : 'relative flex-1 flex items-center'
          }
        >
          <SVGCheckpoint
            step={i}
            isActive={i <= currentIndex}
            onClick={() => setCurrentSection(Array.isArray(s) ? s[0] : s)}
          />
          {i !== a.length - 1 && (
            <div className='timeline-bullets bg-repeat-x h-1 w-full rounded-full'></div>
          )}
        </div>
      ))}
    </div>
  )
}

export default Timeline
