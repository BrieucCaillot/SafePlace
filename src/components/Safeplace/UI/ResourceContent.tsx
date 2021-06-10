import { useCallback, useEffect, useState } from 'react'
import { CSSTransition } from 'react-transition-group'

import useSafeplaceStore from '@/stores/useSafeplaceStore'
import useUserStore from '@/stores/useUserStore'
import ResourceSteps from '@/constants/enums/ResourceSteps'
import Routes from '@/constants/enums/Routes'

import SVGCross from '@/components/common/UI/SVG/SVGCross'

const ResourceContent = (show: { show: boolean }) => {
  const isCameraTravelling = useSafeplaceStore((s) => s.isCameraTravelling)
  const router = useUserStore((s) => s.router)

  const [hide, setHide] = useState(true)

  const [currentStep, setCurrentStep] = useState<ResourceSteps>(
    ResourceSteps.Summary
  )

  useEffect(() => {
    setTimeout(() => setHide(false), 1000)
  }, [])

  const onCloseButtonClick = useCallback(() => {
    setHide(true)
    setTimeout(() => router.push(Routes.Resources), 1200)
  }, [router])

  return (
    <>
      <CSSTransition
        in={show && !hide && !isCameraTravelling}
        timeout={2000}
        classNames='elem-fade'
        mountOnEnter
        unmountOnExit
        appear
      >
        <div
          id='resources'
          className='relative bg-secondary fadeIn flex-1 pointer-events-auto h-full px-10 md:px-14 py-5 md:py-7 ml-10 sm:ml-24 lg:ml-80 rounded-2xl w-full max-w-md md:max-w-xl max-h-96 md:max-h-80'
        >
          <nav className='pb-7 font-sans'>
            <ul className='flex justify-center text-sm'>
              {Object.values(ResourceSteps).map((stepName, i) => (
                <li
                  key={i}
                  className={`resource-step-link font-bold mx-4 cursor-pointer ${
                    currentStep === stepName
                      ? 'resource-step-link__active text-tertiary'
                      : 'text-black'
                  }`}
                  onClick={() => setCurrentStep(stepName)}
                >
                  {stepName}
                </li>
              ))}
            </ul>
          </nav>
          <div
            className='button-close absolute top-7 right-8 h-4 w-4 transition-all duration-500 cursor-pointer text-tertiary'
            onClick={onCloseButtonClick}
          >
            <SVGCross />
          </div>
          {currentStep == ResourceSteps.Summary && (
            <div className='fadeIn'>
              <h2 className='text-tertiary text-4xl font-thin pb-4'>
                La balade en montagne
              </h2>
              <p className='font-sans text-black text-stroke-4'>
                La méditation de la montagne est une visualisation qui nous
                permet de nous ancrer et de nous apaiser. <br /> Elle vous
                emmènera, au gré de la musique, dans des paysages harmonieux.{' '}
                <br /> Au travers des interactions, prenez un grand bol d’air
                frais...
              </p>
            </div>
          )}
          {currentStep == ResourceSteps.Advice && (
            <div className='fadeIn'>
              <h2 className='text-tertiary text-4xl font-thin pb-4'>
                Un conseil pour la route
              </h2>
              <p className='font-sans text-black text-stroke-4'>
                Quotidiennement, posez-vous pendant 3 à 5 minutes. Fermez les
                yeux pour vous reconnecter à votre souffle et votre état
                intérieur. Pour vous aider, portez votre attention sur chacun de
                vos 5 sens.
              </p>
            </div>
          )}
          {currentStep == ResourceSteps.Poem && (
            <div className='fadeIn'>
              <p className='font-sans text-black text-stroke-4 italic pr-24'>
                «Les oiseaux ont disparu dans le ciel, <br />
                Le dernier nuage s’est <br />
                évanoui. Nous sommes assis ensemble, <br />
                La montagne et moi, <br />
                Jusqu’à ce que, seule, la montagne demeure.»
              </p>
              <span className='block font-sans text-black text-stroke-4 italic text-right pt-4'>
                Li Po (701-762), s.d.
              </span>
            </div>
          )}
          {currentStep == ResourceSteps.Further && (
            <div className='fadeIn'>
              <h2 className='text-tertiary text-4xl font-thin pb-4'>
                Les ressources externes
              </h2>
              <p className='font-sans text-black text-stroke-4'>
                <span className='block text-white'>La méditation Guidée :</span>
                <span className='block'>
                  JonKabat-Zinn par Bernard Giraudeau
                </span>
              </p>
              <p className='font-sans text-black text-stroke-4 pt-4'>
                <span className='block text-white'>Les livres :</span>
                <span className='block'>
                  - L'incroyable pouvoir du souffle, Stéphanie Brillant
                </span>
                <span className='block'>
                  - Comment mieux respirer, Nicole Bordeleau
                </span>
              </p>
            </div>
          )}
        </div>
      </CSSTransition>
    </>
  )
}

export default ResourceContent
