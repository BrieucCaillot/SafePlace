const OnBoardingTransition = () => {
  return (
    <div id='on-boarding-transition' className='relative h-full w-full'>
      <img
        className='object-cover h-full w-full'
        src='/img/transition.png'
        alt='transition'
      />
      <p className='absolute bottom-20 w-full text-center text-black'>
        Splashscreen + Transition sonore
      </p>
    </div>
  )
}

export default OnBoardingTransition
