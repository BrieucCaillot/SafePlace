import React from 'react'
import { TransitionStatus } from 'react-transition-group'

import useTransitionStatus from '@/hooks/useTransitionStatus'

import ResourceContent from '@/components/Safeplace/UI/ResourceContent'

const ResourceJourney = ({ status }: { status: TransitionStatus }) => {
  const show = useTransitionStatus(status)

  return (
    <>
      <div className='flex flex-col h-full justify-center'>
        <ResourceContent show={show} />
      </div>
    </>
  )
}

export default ResourceJourney
