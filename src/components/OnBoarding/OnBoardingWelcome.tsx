const OnBoardingWelcome = ({ onStart }) => {
  return (
    <div id='on-boarding-welcome' className='h-full'>
      <img
        className='absolute top-32 md:top-40 left-1/2 transform -translate-x-1/2'
        src='/img/index/logo.png'
        alt='safeplace-logo'
      />
      <button
        onClick={onStart}
        className='absolute bottom-8 left-1/2 transform -translate-x-1/2 text-primary text-xl rounded px-10 py-3 focus:outline-none cursor-pointer pointer-events-auto'
      >
        Lancer l'experience
      </button>
    </div>
  )
}

export default OnBoardingWelcome
