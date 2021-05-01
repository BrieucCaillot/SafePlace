import React from 'react'
import Link from 'next/link'

import PortalUI from '@/components/common/UI/PortalUI'

const About = () => {
  return (
    <>
      <PortalUI selector='#layout-header-right'>
        <Link href='/' as='/'>
          <a className='relative button-stonecut tracking-widest text-lg text-secondary'>
            Accueil
          </a>
        </Link>
      </PortalUI>

      <main className='h-full bg-home bg-no-repeat bg-top bg-cover pointer-events-auto'>
        <div className='container h-full'>
          <div className='flex w-full md:w-3/4 mx-auto h-full flex-col justify-center items-center text-center'>
            <h1 className='text-secondary tracking-widest text-5xl pb-9'>
              Projet
            </h1>
            <p className='text-secondary tracking-widest text-base'>
              Accordez-vous des instants, dans un monde calme et serein : votre
              safe place.
            </p>
            <p className='text-secondary tracking-widest text-base'>
              Prenez le temps de vous imprégner de la quiétude du lieu, en le
              parcourant.
            </p>
            <p className='text-secondary tracking-widest text-base'>
              Laissez-vous porter dans des voyages narratifs, qui vous
              apporteront <br /> tranquillité et relaxation aux fils des
              interactions.
            </p>
            <h2 className='text-secondary tracking-widest text-5xl pt-12 pb-9'>
              Crédits
            </h2>
            <div className='flex w-full'>
              <div className='flex flex-col w-full md:w-1/2'>
                <h3 className='text-white tracking-wider font-serif italic pb-3'>
                  Designers
                </h3>
                <p className='text-secondary tracking-wider'>
                  Marie-Liesse de Solages
                </p>
                <p className='text-secondary tracking-wider'>
                  Alexandre Gomez Pardo
                </p>
                <p className='text-secondary tracking-wider'>Roxane Peuvrier</p>
              </div>

              <div className='flex flex-col w-full md:w-1/2'>
                <h3 className='text-white tracking-wider font-serif italic pb-3'>
                  Développeurs
                </h3>
                <p className='text-secondary tracking-wider'>Léon Baudouin</p>
                <p className='text-secondary tracking-wider'>Brieuc Caillot</p>
              </div>
            </div>
            <div className='flex w-full pt-8'>
              <div className='flex flex-col w-full md:w-1/2'>
                <h3 className='text-white tracking-wider font-serif italic pb-3'>
                  Voix off
                </h3>
                <p className='text-secondary tracking-wider'>Artiste</p>
              </div>
              <div className='flex flex-col w-full md:w-1/2'>
                <h3 className='text-white tracking-wider font-serif italic pb-3'>
                  Musique
                </h3>
                <p className='text-secondary tracking-wider'>Artiste</p>
              </div>
            </div>
            <p className='text-secondary tracking-widest pt-9 pb-9'>
              Nous remercions tout l'équipe pédagogique de Gobelins
            </p>
            <img
              className='w-16'
              src='/img/about/logo-gobelins.png'
              alt='logo-gobelins'
            />
          </div>
        </div>
      </main>
    </>
  )
}

export default About
