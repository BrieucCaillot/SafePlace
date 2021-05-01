import { ReactNode, useCallback, useEffect, useMemo } from 'react'
import * as THREE from 'three'

import SafeplacePOI from '@/constants/enums/SafeplacePOI'
import Place from '@/constants/enums/Place'
import AudioStatus from '@/constants/enums/Audio'
import { VoiceoverSafeplace } from '@/constants/enums/Voiceover'

import useSafeplaceStore from '@/stores/useSafeplaceStore'
import useAudioStore from '@/stores/useAudioStore'
import useSavePOIData from '@/hooks/POI/useSavePOIData'

import ColumnLink from '@/components/Safeplace/Canvas/ColumLocation/ColumnLink/ColumnLink'
import useUserStore from '@/stores/useUserStore'

const ColumnLocation = ({
  safeplacePOI,
  columnObj,
  children,
}: {
  safeplacePOI: SafeplacePOI
  columnObj: THREE.Object3D
  children?: ReactNode
}) => {
  const isCurrentlyAvailable = useSafeplaceStore((s) =>
    s.isCurrentlyAvailable(safeplacePOI)
  )
  const setCurrentPOI = useSafeplaceStore((s) => s.setCurrentPOI)

  const isVoiceoverInsidePlayed = useAudioStore((s) =>
    s.checkVoiceoverStatus(VoiceoverSafeplace.Inside, AudioStatus.Played)
  )

  const collider = useMemo(
    () => columnObj.children.find((obj) => obj.type === 'Mesh') as THREE.Mesh,
    []
  )

  const columnLinkPosition = useMemo(
    () => new THREE.Vector3(0, 1.9, 0).add(collider.position),
    [collider]
  )

  const camera = useMemo(
    () =>
      columnObj.children
        .find((o) => o.type === 'Object3D')
        ?.children.find(
          (o) => o.type === 'PerspectiveCamera'
        ) as THREE.PerspectiveCamera,
    []
  )

  useSavePOIData(safeplacePOI, camera)

  return (
    <group
      position={columnObj.position}
      rotation={columnObj.rotation}
      scale={columnObj.scale}
    >
      {/* <mesh
        geometry={collider.geometry}
        material={collider.material}
        visible={false}
        onClick={() => console.log(safeplacePOI)}
      /> */}
      {children}
      <ColumnLink
        show={isVoiceoverInsidePlayed && isCurrentlyAvailable}
        onColumnClick={() => setCurrentPOI(safeplacePOI)}
        position={columnLinkPosition}
      />
    </group>
  )
}

export default ColumnLocation
