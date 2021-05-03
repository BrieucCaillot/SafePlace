import React, { useCallback, useMemo } from 'react'
import * as THREE from 'three'

import useSafeplaceStore from '@/stores/useSafeplaceStore'
import SafeplacePOI from '@/constants/enums/SafeplacePOI'

import ColumnLink from '@/components/Safeplace/Canvas/ColumLocation/ColumnLink/ColumnLink'
import { Router } from 'next/router'
import useUserStore from '@/stores/useUserStore'

const ShelterResources = ({ resources }: { resources: THREE.Object3D }) => {
  const router = useUserStore((s) => s.router)

  const setCurrentPOI = useSafeplaceStore((s) => s.setCurrentPOI)
  const isCurrentlyAvailable = useSafeplaceStore((s) =>
    s.isCurrentlyAvailable(SafeplacePOI.ResourceFocused)
  )

  const mountainTrophy = useMemo(() => resources.children[0], [])

  const onLinkClick = useCallback(() => router.push('/resource/journey'), [])

  return (
    <group position={resources.position}>
      <primitive object={mountainTrophy}>
        <ColumnLink show={isCurrentlyAvailable} onColumnClick={onLinkClick} />
      </primitive>
    </group>
  )
}

export default ShelterResources
