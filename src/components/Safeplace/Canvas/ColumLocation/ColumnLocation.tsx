import { useEffect, useMemo, useState } from 'react'

import useSafeplaceStore from '@/stores/useSafeplaceStore'
import useAudioStore, {
  VoiceoverSafeplace,
  VoiceoverStatus,
} from '@/stores/useAudioStore'
import Place from 'constants/enums/Place'
import SafeplacePOI from 'constants/enums/SafeplacePOI'
import useSavePOIData from '@/hooks/POI/useSavePOIData'
import ColumnLink from '@/components/Safeplace/Canvas/ColumLocation/ColumnLink/ColumnLink'

const ColumnLocation = ({
  safeplacePOI,
  columnObj,
  onClick = () => {},
}: {
  safeplacePOI: SafeplacePOI
  columnObj: THREE.Object3D
  onClick?: () => void
}) => {
  const isCurrentlyAvailable = useSafeplaceStore((state) =>
    state.isCurrentlyAvailable(safeplacePOI)
  )
  const currentPOI = useSafeplaceStore((state) => state.currentPOI)
  const isCameraTravelling = useSafeplaceStore(
    (state) => state.isCameraTravelling
  )
  const setCurrentVoiceover = useAudioStore(
    (state) => state.setCurrentVoiceover
  )
  const isVoiceoverInsidePlayed = useAudioStore((state) =>
    state.isVoiceoverPlayed(VoiceoverSafeplace.Inside)
  )
  const [isVoiceoverPlayable, setIsVoiceoverPlayable] = useState(true)

  useEffect(() => {
    if (currentPOI !== SafeplacePOI.MountainColumn || !isVoiceoverPlayable)
      return
    setIsVoiceoverPlayable(false)
    console.log('will play')
    setCurrentVoiceover(Place.Safeplace, VoiceoverSafeplace.MountainColumn)
  }, [isVoiceoverPlayable, currentPOI, isCameraTravelling])

  const showColumnLink = useMemo(
    () => isVoiceoverInsidePlayed && isCurrentlyAvailable,
    [isVoiceoverInsidePlayed, isCurrentlyAvailable]
  )

  const column = useMemo(
    () =>
      columnObj.children.find(
        (obj) => obj.type === 'Mesh' && !obj.name.includes('column_rock')
      ) as THREE.Mesh,
    []
  )

  const column_rock = useMemo(
    () =>
      columnObj.children.find((obj) =>
        obj.name.includes('_rock')
      ) as THREE.Mesh,
    []
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
      <ColumnLink
        safeplacePOI={safeplacePOI}
        show={showColumnLink}
        position={column.position}
      />

      <mesh
        name={column_rock.name}
        position={column_rock.position}
        scale={column_rock.scale}
        material={column_rock.material}
        geometry={column_rock.geometry}
      />
      <mesh
        name={column.name}
        position={column.position}
        scale={column.scale}
        material={column.material}
        geometry={column.geometry}
        onClick={onClick}
      />
    </group>
  )
}

export default ColumnLocation
