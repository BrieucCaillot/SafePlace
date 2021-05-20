import { useEffect, useRef } from 'react'
import gsap from 'gsap'

const offset = 300

const TransitionClouds = () => {
  const timelineRef = useRef<GSAPTimeline>()

  const cloudsContainer = useRef<HTMLDivElement>(null)
  const leftTop = useRef<HTMLDivElement>(null)
  const leftBottom = useRef<HTMLDivElement>(null)
  const rightTop = useRef<HTMLDivElement>(null)
  const rightBottom = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tl = gsap.timeline({
      paused: true,
      defaults: {
        duration: 3,
        ease: 'power3.out',
      },
    })
    tl.from(cloudsContainer.current, {
      autoAlpha: 0,
    })
    tl.from(
      leftTop.current,
      {
        x: -offset,
        y: -offset,
      },
      '<'
    )
    tl.from(
      leftBottom.current,
      {
        x: -offset,
        y: offset,
      },
      '<'
    )
    tl.from(
      rightTop.current,
      {
        x: offset,
        y: -offset,
        // autoAlpha: 0,
      },
      '<'
    )
    tl.from(
      rightBottom.current,
      {
        x: offset,
        y: offset,
      },
      '<'
    )
    timelineRef.current = tl
  }, [])

  // useEffect(() => {
  //   switch (cloudsTransitionStatus) {
  //     case AnimationStatus.Start:
  //       timelineRef.current.play()
  //       break
  //     case AnimationStatus.Reverse:
  //       timelineRef.current.reverse(0)
  //       break
  //   }
  // }, [cloudsTransitionStatus])

  return (
    <div
      ref={cloudsContainer}
      id='transition-clouds'
      className='flex absolute top-0 z-10 h-full w-full transition-colors'
    >
      <div
        id='transition-clouds-left'
        className='flex flex-col w-1/2 h-full transform-gpu scale-300'
      >
        <div
          ref={leftTop}
          id='transition-clouds-left-top'
          className='flex flex-col flex-1'
        >
          <span className='cloud-img block animate-spin-cloud-medium -mb-96 flex-1'></span>
          <span className='cloud-img block animate-spin-cloud-slow -mb-40 flex-1'></span>
        </div>
        <div
          ref={leftBottom}
          id='transition-clouds-left-bottom'
          className='flex flex-col flex-1'
        >
          <span className='cloud-img block animate-spin-cloud-slow -mt-40 flex-1'></span>
          <span className='cloud-img block animate-spin-cloud-medium -mt-96  flex-1'></span>
        </div>
      </div>
      <div
        id='transition-clouds-right'
        className='flex flex-col w-1/2 h-full transform-gpu scale-300'
      >
        <div
          ref={rightTop}
          id='transition-clouds-right-bottom'
          className='flex flex-col flex-1'
        >
          <span className='cloud-img block animate-spin-cloud-medium -mb-96 flex-1'></span>
          <span className='cloud-img block animate-spin-cloud-slow -mb-40 flex-1'></span>
        </div>
        <div
          ref={rightBottom}
          id='transition-clouds-right-bottom'
          className='flex flex-col flex-1'
        >
          <span className='cloud-img block animate-spin-cloud-slow -mt-40 flex-1'></span>
          <span className='cloud-img block animate-spin-cloud-medium -mt-96  flex-1'></span>
        </div>
      </div>
    </div>
  )
}

export default TransitionClouds
