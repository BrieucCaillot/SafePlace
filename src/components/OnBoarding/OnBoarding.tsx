import { useEffect } from 'react'
import OnBoardingWelcome from '@/components/OnBoarding/OnBoardingWelcome'
import OnBoardingTransition from './OnBoardingTransition'

const OnBoarding = () => {
  useEffect(() => console.log('mdrr'), [])

  return (
    <div
      id='on-boarding'
      className='h-full w-full bg-white pointer-events-auto'
    >
      <OnBoardingWelcome />
      <OnBoardingTransition />
    </div>
  )
}

export default OnBoarding
