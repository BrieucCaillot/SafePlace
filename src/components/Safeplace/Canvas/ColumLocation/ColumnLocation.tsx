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

  const [camContainer, rock, column] = useMemo(
    () => columnObj.children as [THREE.Object3D, THREE.Mesh, THREE.Mesh],
    []
  )

  const columnLinkPosition = useMemo(
    () => new THREE.Vector3(0, 1.9, 0).add(column.position),
    [column]
  )

  const camera = useMemo(
    () =>
      camContainer.children.find(
        (o) => o.type === 'PerspectiveCamera'
      ) as THREE.PerspectiveCamera,
    [camContainer]
  )

  console.log(columnObj)

  useSavePOIData(safeplacePOI, camera)

  return (
    <group
      position={columnObj.position}
      rotation={columnObj.rotation}
      scale={columnObj.scale}
    >
      <mesh
        material={column.material}
        geometry={column.geometry}
        position={column.position}
        rotation={column.rotation}
        scale={column.scale}
      />
      <mesh
        material={rock.material}
        geometry={rock.geometry}
        position={rock.position}
        rotation={rock.rotation}
        scale={rock.scale}
      />
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
