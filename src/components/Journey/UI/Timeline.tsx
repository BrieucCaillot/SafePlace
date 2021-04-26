import { ReactElement, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

import useMountainJourneyStore, {
  MountainSections,
} from '@/stores/useMountainJourneyStore'

const Timeline = () => {
  const currentSection = useMountainJourneyStore(
    (state) => state.currentSection
  )
  const setCurrentSection = useMountainJourneyStore(
    (state) => state.setCurrentSection
  )

  const [timelineProgressClass, setTimelineProgressClass] = useState('w-0')

  const timelineProgressRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    console.log(currentSection)

    switch (currentSection) {
      case MountainSections.One:
        gsap.to(timelineProgressRef.current, {
          width: '0',
          duration: 1,
        })
        break
      case MountainSections.Two:
        gsap.to(timelineProgressRef.current, {
          width: '25%',
          duration: 1,
        })
        break
      case MountainSections.Three:
        gsap.to(timelineProgressRef.current, {
          width: '50%',
          duration: 1,
        })
        break
      case MountainSections.Four:
        gsap.to(timelineProgressRef.current, {
          width: '75%',
          duration: 1,
        })
        break
      case MountainSections.Five:
        gsap.to(timelineProgressRef.current, {
          width: '100%',
          duration: 1,
        })
        break
    }
  }, [currentSection])

  return (
    <div className='relative flex items-center w-full'>
      <div className='absolute top-1/2 transform -translate-y-1/2 bg-white h-1 w-full rounded-full'></div>
      <div
        ref={timelineProgressRef}
        className={`absolute top-1/2 transform -translate-y-1/2 bg-primary h-1 rounded-full`}
      ></div>
      <div className='relative flex-1 flex items-center'>
        <span
          className='block bg-white h-4 w-4 rounded-full pointer-events-auto cursor-pointer'
          onClick={() => setCurrentSection(MountainSections.One)}
        ></span>
      </div>
      <div className='relative flex-1 flex items-center'>
        <span
          className='block bg-white h-4 w-4 rounded-full pointer-events-auto cursor-pointer'
          onClick={() => setCurrentSection(MountainSections.Two)}
        ></span>
      </div>
      <div className='relative flex-1 flex items-center'>
        <span
          className='block bg-white h-4 w-4 rounded-full pointer-events-auto cursor-pointer'
          onClick={() => setCurrentSection(MountainSections.Three)}
        ></span>
      </div>
      <div className='relative flex-1 flex items-center'>
        <span
          className='block bg-white h-4 w-4 rounded-full pointer-events-auto cursor-pointer'
          onClick={() => setCurrentSection(MountainSections.Four)}
        ></span>
      </div>
      <div className='absolute -right-3.5'>
        <span
          className='block bg-white h-4 w-4 rounded-full pointer-events-auto cursor-pointer'
          onClick={() => setCurrentSection(MountainSections.Five)}
        ></span>
      </div>
    </div>
  )
}

export default Timeline
