import { useState } from 'react'
import { useRouter } from 'next/router'

import useAudioStore from '@/stores/useAudioStore'

import useSafeplaceStore from '@/stores/useSafeplaceStore'
import SafeplacePOI from '@/constants/enums/SafeplacePOI'
import { VoiceoverSafeplace } from '@/constants/enums/Voiceover'
import AudioStatus from '@/constants/enums/Audio'
import InstructionsList from '@/constants/enums/InstructionsList'
import Instruction from '@/components/Instructions/Instruction'

const Instructions = () => {
  const router = useRouter()

  const setCurrentPOI = useSafeplaceStore((state) => state.setCurrentPOI)
  const isVoiceoverSafeplaceArivedPlayed = useAudioStore((s) =>
    s.checkVoiceoverStatus(VoiceoverSafeplace.Arrived, AudioStatus.Played)
  )

  const [
    currentInstruction,
    setCurrentInstruction,
  ] = useState<InstructionsList>(InstructionsList.Instruction1)

  return (
    <>
      {isVoiceoverSafeplaceArivedPlayed && (
        <div
          id='instructions'
          className='absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full fadeIn'
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
                setCurrentPOI(SafeplacePOI.Outside)
              }}
            />
          )}
        </div>
      )}
    </>
  )
}

export default Instructions
