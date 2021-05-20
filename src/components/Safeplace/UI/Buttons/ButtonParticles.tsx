import { useEffect, useMemo, useRef } from 'react'
import gsap from 'gsap'

const colors = ['#fae7e7', '#e7c7c7', '#d2a7a7']
const count = 13

const ButtonParticles = ({ direction }: { direction: 'left' | 'right' }) => {
  const particles = useRef<HTMLDivElement>()

  const isLeft = useMemo(() => direction === 'left', [])

  const position = useMemo(() => (isLeft ? '-scale-x-1 left-0' : 'right-0'), [
    isLeft,
  ])

  useEffect(() => {
    gsap.fromTo(
      particles.current,
      {
        x: isLeft ? -100 : 100,
        y: isLeft ? 50 : 50,
      },
      {
        y: 0,
        x: 0,
        duration: 4,
        autoAlpha: 0,
      }
    )
  }, [])

  return (
    <div
      ref={particles}
      className={`shape-particles absolute ${position} top-1/2 transform-gpu -translate-y-1/2 pointer-events-none`}
    >
      <div className='relative h-full w-full'>
        {Array(count)
          .fill(null)
          .map((elem, index) => (
            <div
              key={index}
              className={`shape shape-particle shape-particle-${index} transition-all duration-2000`}
              style={{
                backgroundColor:
                  colors[Math.floor(Math.random() * colors.length)],
              }}
            ></div>
          ))}
      </div>
    </div>
  )
}

export default ButtonParticles