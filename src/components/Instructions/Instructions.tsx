import { useState } from 'react'
import { useRouter } from 'next/router'

import useSafeplaceStore from '@/stores/useSafeplaceStore'
import Routes from '@/constants/enums/Routes'
import SafeplacePOI from '@/constants/enums/SafeplacePOI'
import InstructionsList from '@/constants/enums/InstructionsList'
import Instruction from '@/components/Instructions/Instruction'

const Instructions = () => {
  const router = useRouter()

  const [
    currentInstruction,
    setCurrentInstruction,
  ] = useState<InstructionsList>(InstructionsList.Instruction1)

  return (
    <div id='instructions' className='fadeIn flex flex-col h-full w-full'>
      {currentInstruction == InstructionsList.Instruction1 && (
        <Instruction
          instruction={InstructionsList.Instruction1}
          text={`Pour une expérience plus riche, je vous recommande de \n prendre un casque et de désactiver vos notifications.`}
          onNextStep={() =>
            setCurrentInstruction(InstructionsList.Instruction2)
          }
        />
      )}
      {currentInstruction == InstructionsList.Instruction2 && (
        <Instruction
          instruction={InstructionsList.Instruction2}
          text={`Détendez-vous, respirez profondément, \n faites le calme autour de vous.`}
          onNextStep={() =>
            setCurrentInstruction(InstructionsList.Instruction3)
          }
        />
      )}
      {currentInstruction == InstructionsList.Instruction3 && (
        <Instruction
          instruction={InstructionsList.Instruction3}
          text={`Installez-vous confortablement, le dos droit, \n les pieds bien à plat et quand vous serez prêt, \n venez me retrouver dans votre safe place.`}
          onNextStep={() => {
            router.push(Routes.Safeplace)
            const { setCurrentPOI } = useSafeplaceStore.getState()
            setCurrentPOI(SafeplacePOI.Outside)
          }}
        />
      )}
    </div>
  )
}

export default Instructions
