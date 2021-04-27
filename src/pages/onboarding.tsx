import { useEffect, useState } from 'react'
import { NextRouter, useRouter } from 'next/router'

import Instruction from '@/components/Instructions/Instruction'

export enum Instructions {
  Instruction1 = 'Instruction1',
  Instruction2 = 'Instruction2',
  Instruction3 = 'Instruction3',
}

const OnBoarding = () => {
  const [currentInstruction, setCurrentInstruction] = useState<Instructions>(
    Instructions.Instruction1
  )

  const router = useRouter()

  useEffect(() => {
    console.log(router)
  }, [])

  return (
    <>
      <div
        id='instructions'
        className='absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2'
      >
        {currentInstruction == Instructions.Instruction1 && (
          <Instruction
            Instruction={Instructions.Instruction1}
            text='Pour une expérience plus riche, je vous recommande de prendre un casque et de désactiver vos notifications.'
            onNextStep={() => setCurrentInstruction(Instructions.Instruction2)}
          />
        )}
        {currentInstruction == Instructions.Instruction2 && (
          <Instruction
            Instruction={Instructions.Instruction2}
            text='Détendez-vous, respirez profondément, faites le calme autour de vous.'
            onNextStep={() => setCurrentInstruction(Instructions.Instruction3)}
          />
        )}
        {currentInstruction == Instructions.Instruction3 && (
          <Instruction
            Instruction={Instructions.Instruction3}
            text='Installez-vous confortablement, le dos droit, les pieds bien à plat et quand vous serez prêt, venez me retrouver dans votre safe place.'
            onNextStep={() => {
              router.push('/safeplace')
            }}
          />
        )}
      </div>
    </>
  )
}

export default OnBoarding
