import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import useAudioStore from '@/stores/useAudioStore'
import Place from '@/constants/enums/Place'
import Ambiants from '@/constants/enums/Ambiant'

import Instruction from '@/components/Instructions/Instruction'
import InstructionsList from '@/constants/enums/InstructionsList'

const Instructions = () => {
  const [
    currentInstruction,
    setCurrentInstruction,
  ] = useState<InstructionsList>(InstructionsList.Instruction1)

  const router = useRouter()

  const setCurrentAmbiant = useAudioStore((state) => state.setCurrentAmbiant)

  useEffect(() => {
    setCurrentAmbiant(Place.Safeplace, Ambiants.Safeplace)
  }, [])

  return (
    <div
      id='instructions'
      className='absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full'
    >
      {currentInstruction == InstructionsList.Instruction1 && (
        <Instruction
          instruction={InstructionsList.Instruction1}
          text={`Pour une expérience plus riche, je vous recommande de prendre \n un casque et de désactiver vos \n notifications.`}
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
            router.push('/safeplace')
          }}
        />
      )}
    </div>
  )
}

export default Instructions
