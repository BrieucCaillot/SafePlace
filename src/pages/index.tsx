import Link from 'next/link'
import React from 'react'

const Index = () => {
  return (
    <>
      <div id='on-boarding-welcome' className='relative bg-black h-screen'>
        <img
          className='absolute top-32 md:top-40 left-1/2 transform -translate-x-1/2'
          src='/img/index/logo.png'
          alt='safeplace-logo'
        />
        <Link href='/safeplace'>
          <button className='absolute bottom-8 left-1/2 transform -translate-x-1/2 text-primary text-xl rounded px-10 py-3 focus:outline-none cursor-pointer pointer-events-auto'>
            Lancer l'experience
          </button>
        </Link>
      </div>
    </>
  )
}

export default Index
