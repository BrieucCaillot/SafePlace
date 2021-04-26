import { useEffect, useState } from 'react'
import { NextRouter } from 'next/router'

import Rule from '@/components/Rules/Rule'
import useRulesStore, { Rules } from '@/stores/useRulesStore'

const OneRule = ({ router }: { router: NextRouter }) => {
  const currentRule = useRulesStore((state) => state.currentRule)
  const setCurrentRule = useRulesStore((state) => state.setCurrentRule)

  const [step, setStep] = useState(0)

  const onClick = () => {
    setStep(step == 0 ? 1 : 0)
  }

  return (
    <>
      <div
        id='rules'
        className='absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2'
      >
        {currentRule == Rules.Rule1 && (
          <Rule
            rule={Rules.Rule1}
            text='Pour une expérience plus riche, je vous recommande de prendre un casque
        et de désactiver vos notifications.'
            onNextStep={() => setCurrentRule(Rules.Rule2)}
          />
        )}
        {currentRule == Rules.Rule2 && (
          <Rule
            rule={Rules.Rule2}
            text='Pour réaliser certaines interactions, j’aurais besoin de votre caméra.'
            onNextStep={() => setCurrentRule(Rules.Rule3)}
          />
        )}

        {currentRule == Rules.Rule3 && (
          <Rule
            rule={Rules.Rule3}
            text='Détendez-vous, respirez profondément, faites le calme autour de vous.'
            onNextStep={() => setCurrentRule(Rules.Rule4)}
          />
        )}
        {currentRule == Rules.Rule4 && (
          <Rule
            rule={Rules.Rule4}
            text='Installez-vous confortablement, le dos droit, les pieds bien à plat et quand vous serez prêt, venez me retrouver dans votre safe place.'
            onNextStep={() => {
              // router.push('/safeplace')
            }}
          />
        )}
      </div>
    </>
  )
}

export default OneRule
