import { useState } from 'react'
import { useRouter } from 'next/router'

import Instruction from '@/components/Instructions/Instruction'
import InstructionsList from '@/constants/enums/InstructionsList'

const Instructions = () => {
  const [
    currentInstruction,
    setCurrentInstruction,
  ] = useState<InstructionsList>(InstructionsList.Instruction1)

  const router = useRouter()

  return (
    <div
      id='instructions'
      className='absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2'
    >
      {currentInstruction == InstructionsList.Instruction1 && (
        <Instruction
          instruction={InstructionsList.Instruction1}
          text='Pour une expérience plus riche, je vous recommande de prendre un casque et de désactiver vos notifications.'
          onNextStep={() =>
            setCurrentInstruction(InstructionsList.Instruction2)
          }
        />
      )}
      {currentInstruction == InstructionsList.Instruction2 && (
        <Instruction
          instruction={InstructionsList.Instruction2}
          text='Détendez-vous, respirez profondément, faites le calme autour de vous.'
          onNextStep={() =>
            setCurrentInstruction(InstructionsList.Instruction3)
          }
        />
      )}
      {currentInstruction == InstructionsList.Instruction3 && (
        <Instruction
          instruction={InstructionsList.Instruction3}
          text='Installez-vous confortablement, le dos droit, les pieds bien à plat et quand vous serez prêt, venez me retrouver dans votre safe place.'
          onNextStep={() => {
            router.push('/safeplace')
          }}
        />
      )}
    </div>
  )
}

export default Instructions
