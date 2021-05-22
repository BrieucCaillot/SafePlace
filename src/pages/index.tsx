import React from 'react'
import Link from 'next/link'

import Routes from '@/constants/enums/Routes'

import PortalUI from '@/components/common/UI/PortalUI'
import ButtonStonecut from '@/components/common/UI/Buttons/ButtonStonecut'

const Index = () => {
  return (
    <>
      <PortalUI selector='#layout-header-right'>
        <ButtonStonecut
          show={true}
          className='text-primary cursor-pointer'
          route={Routes.About}
        >
          A propos
        </ButtonStonecut>
      </PortalUI>

      <div
        id='home'
        className='relative bg-home bg-no-repeat bg-bottom bg-cover h-screen'
      >
        {/* <div className='home'></div> */}
        <img
          className='absolute top-40 left-1/2 transform-gpu -translate-x-1/2 ml-9 fadeIn'
          src='/img/index/logo.png'
          alt='safeplace-logo'
        />
        <div className='absolute bottom-16 flex justify-center w-full fadeIn'>
          <Link href={Routes.OnBoarding} as={Routes.OnBoarding}>
            <button className='relative button-stonefull text-white text-xl font-bold tracking-widest rounded px-10 py-3 focus:outline-none cursor-pointer pointer-events-auto'>
              Lancer l'experience
            </button>
          </Link>
        </div>
      </div>
    </>
  )
}

export default Index
