import React from 'react'

import ResourceContent from '@/components/Safeplace/UI/ResourceContent'
import PortalUI from '@/components/common/UI/PortalUI'
import SafeplaceAudio from '@/components/Safeplace/SafeplaceAudio'
import ResourcesButton from '@/components/Safeplace/UI/ResourcesButton'

const ResourceJourney = () => {
  return (
    <>
      <SafeplaceAudio />
      <ResourceContent />
      <PortalUI selector='#layout-bottom-left'>
        <ResourcesButton />
      </PortalUI>
    </>
  )
}

export default ResourceJourney
