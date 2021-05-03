import React from 'react'

import useSafeplaceStore from '@/stores/useSafeplaceStore'

import ResourceContent from '@/components/Safeplace/UI/ResourceContent'
import PortalUI from '@/components/common/UI/PortalUI'
import ResourcesButton from '@/components/Safeplace/UI/ResourcesButton'

const ResourceJourney = () => {
  const isCameraTravelling = useSafeplaceStore((s) => s.isCameraTravelling)

  return (
    <>
      {!isCameraTravelling && <ResourceContent />}
      <PortalUI selector='#layout-bottom-left'>
        <ResourcesButton />
      </PortalUI>
    </>
  )
}

export default ResourceJourney
