import React from 'react'

import ResourceContent from '@/components/Safeplace/UI/ResourceContent'
import PortalUI from '@/components/common/UI/PortalUI'
import ResourcesButton from '@/components/Safeplace/UI/ResourcesButton'

const ResourceJourney = () => {
  return (
    <>
      <ResourceContent />
      <PortalUI selector='#layout-bottom-left'>
        <ResourcesButton />
      </PortalUI>
    </>
  )
}

export default ResourceJourney
