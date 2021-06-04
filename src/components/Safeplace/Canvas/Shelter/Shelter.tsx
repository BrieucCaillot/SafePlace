import { useCallback, useEffect, useMemo } from 'react'
import * as THREE from 'three'

import useUserStore from '@/stores/useUserStore'
import useSafeplaceStore from '@/stores/useSafeplaceStore'
import SafeplacePOI from '@/constants/enums/SafeplacePOI'
import useSavePOIData from '@/hooks/POI/useSavePOIData'

import ColumnLink from '@/components/Safeplace/Canvas/Columns/ColumnLink/ColumnLink'
import ShelterResources from '@/components/Safeplace/Canvas/Shelter/ShelterResources'
import SceneShorthand from '@/components/common/Canvas/SceneShorthand'

const Shelter = ({ object }: { object: THREE.Object3D }) => {
  const isJourneyCompleted = useUserStore((s) => s.userData.journey)

  const isCurrentlyAvailable = useSafeplaceStore((s) =>
    s.isCurrentlyAvailable(SafeplacePOI.Inside)
  )
  const setCurrentPOI = useSafeplaceStore((s) => s.setCurrentPOI)

  const [resources, shelterCams, shelterMesh] = useMemo(
    () => [...object.children],
    []
  )

  const [
    shelterOnBoardingCam,
    shelterResourceFocus,
    shelterResourcesCam,
    shelterInsideCam,
    shelterOutsideCam,
  ] = useMemo(() => [...shelterCams.children], [])

  useSavePOIData(SafeplacePOI.OnBoarding, shelterOnBoardingCam.children[0])
  useSavePOIData(SafeplacePOI.Outside, shelterOutsideCam.children[0])
  useSavePOIData(SafeplacePOI.Inside, shelterInsideCam.children[0])
  useSavePOIData(SafeplacePOI.Resources, shelterResourcesCam.children[0])
  useSavePOIData(SafeplacePOI.ResourceFocused, shelterResourceFocus.children[0])

  const onLinkClick = useCallback(() => setCurrentPOI(SafeplacePOI.Inside), [])

  const shelterLinkPosition = useMemo(() => {
    const { x, y, z } = shelterInsideCam.position
    return new THREE.Vector3(x - 1, -1, z)
  }, [])

  useEffect(() => {
    shelterMesh.children.map(
      (c: THREE.Mesh) => ((c.material as THREE.MeshBasicMaterial).fog = false)
    )
  }, [])

  return (
    <group position={object.position}>
      {isJourneyCompleted && <ShelterResources resources={resources} />}
      <SceneShorthand object={shelterMesh} />
      <ColumnLink
        show={isCurrentlyAvailable}
        onColumnClick={onLinkClick}
        position={shelterLinkPosition}
      />
    </group>
  )
}

export default Shelter
