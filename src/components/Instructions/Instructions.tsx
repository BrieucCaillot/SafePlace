import { useState } from 'react'
import { useRouter } from 'next/router'

import useSafeplaceStore from '@/stores/useSafeplaceStore'
import Routes from '@/constants/enums/Routes'
import SafeplacePOI from '@/constants/enums/SafeplacePOI'
import Instruction from '@/components/Instructions/Instruction'

const Instructions = ({ show }: { show: boolean }) => {
  const router = useRouter()

  const [currentInstruction, setCurrentInstruction] = useState(0)

  return (
    <div
      id='instructions'
      className='absolute transform-gpu -translate-x-1/2 -translate-y-1/2 top-screen-h/2 left-screen-w/2'
    >
      <Instruction
        show={show}
        instruction={0}
        currentInstruction={currentInstruction}
        text={`Pour une expérience plus riche, je vous recommande de \n prendre un casque et de désactiver vos notifications.`}
        textAnimDuration={9}
        buttonText={'Continuer'}
        onNextStep={() => setCurrentInstruction(1)}
      />
      <Instruction
        show={show}
        instruction={1}
        currentInstruction={currentInstruction}
        text={`Installez-vous confortablement, le dos droit, les pieds bien à plat.`}
        textAnimDuration={6}
        buttonText={'Continuer'}
        onNextStep={() => setCurrentInstruction(2)}
      />
      <Instruction
        show={show}
        instruction={2}
        currentInstruction={currentInstruction}
        text={`Respirez profondément, détendez-vous, faites le calme autour de vous, \n et quand vous serez prêt, venez me retrouver dans votre safeplace.`}
        textAnimDuration={13}
        buttonText={'Rejoindre la safeplace'}
        onNextStep={() => {
          router.push(Routes.Safeplace)
          const { setCurrentPOI } = useSafeplaceStore.getState()
          setCurrentPOI(SafeplacePOI.Outside)
        }}
      />
    </div>
  )
}

export default Instructions
