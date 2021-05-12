import React from 'react'

import ResourceContent from '@/components/Safeplace/UI/ResourceContent'
import PortalUI from '@/components/common/UI/PortalUI'
import ResourcesButton from '@/components/Safeplace/UI/ResourcesButton'

const ResourceJourney = () => {
  return (
    <>
      <div className='flex flex-col h-full justify-center'>
        <ResourceContent />
      </div>
      <PortalUI selector='#layout-bottom-left'>
        <ResourcesButton />
      </PortalUI>
    </>
  )
}

export default ResourceJourney
