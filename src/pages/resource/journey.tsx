import React from 'react'
import { TransitionStatus } from 'react-transition-group'

import useTransitionStatus from '@/hooks/useTransitionStatus'

import ResourceContent from '@/components/Safeplace/UI/ResourceContent'

const ResourceJourney = ({ status }: { status: TransitionStatus }) => {
  const show = useTransitionStatus(status)

  return (
    <>
      <div className='fixed top-screen-h/2 transform-gpu -translate-y-1/2 flex items-center h-full'>
        <ResourceContent show={show} />
      </div>
    </>
  )
}

export default ResourceJourney
