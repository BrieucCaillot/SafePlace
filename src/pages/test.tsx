import { useMemo } from 'react'

import { Howl } from 'howler'

const Test = () => {
  const audio = useMemo(() => {
    var sound = new Howl({
      src: [
        '/audios/voiceover/journey/Intro.mp3',
        '/audios/voiceover/journey/Cairns.mp3',
      ],
    })

    return sound
  }, [])

  const ArrivedOnClick = () => {
    audio.play(0)
  }
  const IntroOnClick = () => {
    audio.play(1)
  }

  return (
    <>
      <div className='absolute top-0 bg-white h-screen w-screen p-20'>
        <div className='flex justify-between pointer-events-auto'>
          <button
            onClick={ArrivedOnClick}
            className='bg-primary p-4 text-white rounded-md cursor-pointer'
          >
            Arrived
          </button>
          <button
            onClick={IntroOnClick}
            className='bg-primary p-4 text-white rounded-md cursor-pointer'
          >
            Intro
          </button>
        </div>
      </div>
    </>
  )
}

export default Test
