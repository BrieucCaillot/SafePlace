import React, { useEffect } from 'react'
import Link from 'next/link'

import useAudioStore from '@/stores/useAudioStore'
import Place from '@/constants/enums/Place'
import Ambiants from '@/constants/enums/Ambiant'

import PortalUI from '@/components/common/UI/PortalUI'

const Index = () => {
  const setCurrentAmbiant = useAudioStore((state) => state.setCurrentAmbiant)

  useEffect(() => {
    setCurrentAmbiant(Place.Safeplace, Ambiants.Safeplace)
  }, [])

  return (
    <>
      <PortalUI selector='#layout-header-right'>
        <Link href='about' as='/about'>
          <a className='relative button-stonecut tracking-widest text-lg text-secondary'>
            À propos
          </a>
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
        <div className='absolute bottom-16 flex justify-center w-full'>
          <Link href='onboarding'>
            <button className='relative button-stonefull text-secondary text-xl font-bold tracking-widest rounded px-10 py-3 focus:outline-none cursor-pointer pointer-events-auto'>
              Lancer l'experience
            </button>
          </Link>
        </div>
      </div>
    </>
  )
}

export default Index
