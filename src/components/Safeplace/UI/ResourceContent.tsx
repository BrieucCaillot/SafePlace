import { useState } from 'react'

import ResourceSteps from '@/constants/enums/ResourceSteps'

const ResourceContent = () => {
  const [currentStep, setCurrentStep] = useState<ResourceSteps>(
    ResourceSteps.Summary
  )

  return (
    <main
      id='resource'
      className='bg-primary fadeIn pointer-events-auto px-10 md:px-14 py-5 md:py-7 rounded-2xl w-full max-w-md md:max-w-xl h-full max-h-96 md:max-h-80 absolute top-1/2 left-20 transform -translate-y-1/2'
    >
      <nav className='pb-7 font-sans'>
        <ul className='flex justify-center text-sm'>
          {Object.values(ResourceSteps).map((stepName, i) => (
            <li
              key={i}
              className={`resource-step-link font-bold px-4 cursor-pointer ${
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
      {currentStep == ResourceSteps.Summary && (
        <div className='fadeIn'>
          <h2 className='text-tertiary text-4xl font-thin pb-4'>
            La balade en montagne
          </h2>
          <p className='font-sans text-black'>
            La méditation de la montagne est une visualisation qui nous permet
            de nous ancrer et de nous apaiser. <br /> Elle vous emmènera, au
            grès de la musique, dans paysages harmonieux. <br /> Au travers des
            interactions, prenez un grand bol d’air frais...
          </p>
        </div>
      )}
      {currentStep == ResourceSteps.Advice && (
        <div className='fadeIn'>
          <h2 className='text-tertiary text-4xl font-thin pb-4'>
            Un conseil pour la route
          </h2>
          <p className='font-sans text-black'>
            Quotidiennement, posez-vous pendant 3 à 5 minutes. Fermez les yeux
            pour vous reconnecter à votre souffle et votre état intérieur. Pour
            vous aidez, portez votre attention sur chacun de vos 5 sens.
          </p>
        </div>
      )}
      {currentStep == ResourceSteps.Poem && (
        <div className='fadeIn'>
          <p className='font-sans text-black italic pr-24'>
            «Les oiseaux ont disparu dans le ciel, <br />
            Le dernier nuage s’est <br />
            évanoui. Nous sommes assis ensemble, <br />
            La montagne et moi, <br />
            Jusqu’à ce que, seule, la montagne demeure.»
          </p>
          <span className='block font-sans text-black italic text-right pt-4'>
            Li Po (701-762), s.d.
          </span>
        </div>
      )}
      {currentStep == ResourceSteps.Further && (
        <div className='fadeIn'>
          <h2 className='text-tertiary text-4xl font-thin pb-4'>
            Les ressources externes
          </h2>
          <p className='font-sans text-black'>
            <span className='block text-white'>La méditation Guidée :</span>
            <span className='block'>JonKabat-Zinn par Bernard Giraudeau</span>
          </p>
          <p className='font-sans text-black pt-4'>
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
    </main>
  )
}

export default ResourceContent
