import { useEffect, useRef } from 'react'
import gsap from 'gsap'

import useJourneyStore, { JourneySection } from '@/stores/useJourneyStore'

const Timeline = () => {
  const currentSection = useJourneyStore((state) => state.currentSection)
  const setCurrentSection = useJourneyStore((state) => state.setSection)

  const timelineProgressRef = useRef<HTMLDivElement>(null)

  const steps = [
    JourneySection.Intro,
    JourneySection.Cairns,
    JourneySection.Lake,
    JourneySection.Bridge,
    JourneySection.Waterfall,
  ]

  useEffect(() => {
    const index = steps.indexOf(currentSection)
    const prog = index / (steps.length - 1)

    gsap.to(timelineProgressRef.current, {
      width: `${prog * 100}%`,
      duration: 1,
    })
  }, [currentSection])

  return (
    <div className='relative flex items-center w-full'>
      <div className='absolute top-1/2 transform -translate-y-1/2 bg-white h-1 w-full rounded-full'></div>
      <div
        ref={timelineProgressRef}
        className={`absolute top-1/2 transform -translate-y-1/2 bg-primary h-1 rounded-full`}
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
          <span
            className='block bg-white h-4 w-4 rounded-full pointer-events-auto cursor-pointer'
            onClick={() => setCurrentSection(s)}
          ></span>
        </div>
      ))}
    </div>
  )
}

export default Timeline
