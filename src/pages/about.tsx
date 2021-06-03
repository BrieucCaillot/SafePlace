import React, { useCallback, useState } from 'react'
import { CSSTransition, TransitionStatus } from 'react-transition-group'

import useUserStore from '@/stores/useUserStore'
import useTransitionStatus from '@/hooks/useTransitionStatus'
import Routes from '@/constants/enums/Routes'

import PortalUI from '@/components/common/UI/PortalUI'
import ButtonStonecut from '@/components/common/UI/Buttons/ButtonStonecut'

const About = ({ status }: { status: TransitionStatus }) => {
  const show = useTransitionStatus(status)

  const router = useUserStore((s) => s.router)

  const [hide, setHide] = useState(false)

  const onHomeButtonClick = useCallback(() => {
    setHide(true)
    setTimeout(() => router.push(Routes.Index), 2000)
  }, [router])

  return (
    <>
      <PortalUI selector='#layout-header-right'>
        <ButtonStonecut
          show={show && !hide}
          className='text-primary cursor-pointer pointer-events-none opacity-0'
          onClick={onHomeButtonClick}
        >
          Accueil
        </ButtonStonecut>
      </PortalUI>

      <div className='relative pointer-events-auto h-screen w-screen'>
        <div className='container h-full'>
          <CSSTransition
            in={show && !hide}
            timeout={2000}
            classNames='elem-fade'
            mountOnEnter
            unmountOnExit
            appear
          >
            <div className='flex opacity-0 w-full xl:w-3/4 mx-auto h-full flex-col justify-start md:justify-center items-center text-center overflow-y-scroll md:overflow-hidden'>
              <h1 className='text-primary tracking-widest text-4xl md:text-5xl py-9 mt-20 md:mt-0'>
                Projet
              </h1>
              <p className='text-primary tracking-widest text-base'>
                Accordez-vous des instants, dans un monde calme et serein :
                votre safe place.
              </p>
              <p className='text-primary tracking-widest text-base'>
                Prenez le temps de vous imprégner de la quiétude du lieu, en le
                parcourant.
              </p>
              <p className='text-primary tracking-widest text-base'>
                Laissez-vous porter dans des voyages narratifs, qui vous
                apporteront <br /> tranquillité et relaxation aux fils des
                interactions.
              </p>
              <h2 className='text-primary tracking-widest text-4xl md:text-5xl pt-12 pb-9'>
                Crédits
              </h2>
              <div className='flex flex-col md:flex-row w-full'>
                <div className='flex flex-col w-full pt-7 md:pt-0 flex-1'>
                  <h3 className='text-white tracking-wider font-serif italic pb-3'>
                    Designers
                  </h3>
                  <p className='text-primary tracking-wider'>
                    Marie-Liesse de Solages
                  </p>
                  <p className='text-primary tracking-wider'>
                    Alexandre Gomez Pardo
                  </p>
                  <p className='text-primary tracking-wider'>Roxane Peuvrier</p>
                </div>
                <div className='flex flex-col w-full pt-7 md:pt-0 flex-1'>
                  <h3 className='text-white tracking-wider font-serif italic pb-3'>
                    Développeurs
                  </h3>
                  <p className='text-primary tracking-wider'>Léon Baudouin</p>
                  <p className='text-primary tracking-wider'>Brieuc Caillot</p>
                </div>
                <div className='flex flex-col w-full pt-7 md:pt-0 flex-1'>
                  <h3 className='text-white tracking-wider font-serif italic pb-3'>
                    Voix off
                  </h3>
                  <p className='text-primary tracking-wider'>Aude</p>
                  <p className='text-primary tracking-wider'>EHRHARDT</p>
                </div>
                <div className='flex flex-col w-full pt-7 md:pt-0 flex-1'>
                  <h3 className='text-white tracking-wider font-serif italic pb-3'>
                    Son
                  </h3>
                  <p className='text-primary tracking-wider'>
                    Gabrielle HILOYTOT
                  </p>
                </div>
              </div>
              <p className='text-primary tracking-widest pt-9 pb-9'>
                Nous remercions tout l'équipe pédagogique de Gobelins
              </p>
              <img
                className='w-20 py-3 mb-20 md:mb-0'
                src='/img/about/logo-gobelins.png'
                alt='logo-gobelins'
              />
            </div>
          </CSSTransition>
        </div>
      </div>
    </>
  )
}

export default About
