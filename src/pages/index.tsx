import React from 'react'
import Link from 'next/link'

import PortalUI from '@/components/common/UI/PortalUI'

const Index = () => {
  return (
    <>
      <PortalUI selector='#layout-header-right'>
        <Link href='about' as='/about'>
          <a className='bg-skyblue border-gray-50 text-black'>À propos</a>
        </Link>
      </PortalUI>

      <div
        id='on-boarding-welcome'
        className='relative bg-home bg-no-repeat bg-bottom bg-cover h-screen'
      >
        <img
          className='absolute top-32 md:top-40 left-1/2 transform -translate-x-1/2'
          src='/img/index/logo.png'
          alt='safeplace-logo'
        />
        <Link href='onboarding'>
          <button className='button-stonefull absolute bottom-8 left-1/2 transform -translate-x-1/2 text-primary text-xl font-bold tracking-widest rounded px-10 py-3 focus:outline-none cursor-pointer pointer-events-auto'>
            Lancer l'experience
          </button>
        </Link>
      </div>
    </>
  )
}

export default Index
