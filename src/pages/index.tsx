import React from 'react'
import Link from 'next/link'

import Routes from '@/constants/enums/Routes'

import PortalUI from '@/components/common/UI/PortalUI'

const Index = () => {
  return (
    <>
      <PortalUI selector='#layout-header-right'>
        <Link href={Routes.About} as={Routes.About}>
          <a className='relative button-stonecut tracking-widest text-lg text-secondary'>
            À propos
          </a>
        </Link>
      </PortalUI>

      <main
        id='home'
        className='relative bg-home bg-no-repeat bg-bottom bg-cover h-screen'
      >
        <img
          className='absolute top-32 md:top-40 left-1/2 transform -translate-x-1/2 fadeIn'
          src='/img/index/logo.png'
          alt='safeplace-logo'
        />
        <div className='absolute bottom-16 flex justify-center w-full fadeIn'>
          <Link href={Routes.OnBoarding} as={Routes.OnBoarding}>
            <button className='relative button-stonefull text-secondary text-xl font-bold tracking-widest rounded px-10 py-3 focus:outline-none cursor-pointer pointer-events-auto'>
              Lancer l'experience
            </button>
          </Link>
        </div>
      </main>
    </>
  )
}

export default Index
