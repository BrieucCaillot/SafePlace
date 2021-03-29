const OnBoardingWelcome = () => {
  return (
    <div id='on-boarding-welcome' className='flex flex-col items-center h-full'>
      <div className='flex flex-col justify-center items-center m-auto w-full md:w-8/12'>
        <h1 className='text-black text-8xl text-center'>SAFE PLACE</h1>
        <button className='bg-blue-500 text-white text-sm rounded px-10 py-3 mt-16 cursor-pointer'>
          Lancer l'experience
        </button>
      </div>
    </div>
  )
}

export default OnBoardingWelcome
