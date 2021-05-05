import React, { useCallback, useMemo } from 'react'
import * as THREE from 'three'

import useSafeplaceStore from '@/stores/useSafeplaceStore'
import SafeplacePOI from '@/constants/enums/SafeplacePOI'

import ColumnLink from '@/components/Safeplace/Canvas/ColumLocation/ColumnLink/ColumnLink'
import useUserStore from '@/stores/useUserStore'
import Routes from '@/constants/enums/Routes'

const ShelterResources = ({ resources }: { resources: THREE.Object3D }) => {
  const router = useUserStore((s) => s.router)

  const isCurrentlyAvailable = useSafeplaceStore((s) =>
    s.isCurrentlyAvailable(SafeplacePOI.ResourceFocused)
  )

  const mountainTrophy = useMemo(() => resources.children[0], [])

  const onLinkClick = useCallback(() => router.push(Routes.ResourcesFocus), [])

  return (
    <group position={resources.position}>
      <primitive object={mountainTrophy}>
        <ColumnLink show={isCurrentlyAvailable} onColumnClick={onLinkClick} />
      </primitive>
    </group>
  )
}

export default ShelterResources
