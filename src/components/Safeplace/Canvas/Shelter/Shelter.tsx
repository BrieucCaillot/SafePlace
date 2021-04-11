import useSavePOIData from '@/hooks/POI/useSavePOIData'
import useSafeplaceStore, { SafeplacePOI } from '@/stores/useSafeplaceStore'
import { useEffect, useMemo, useRef } from 'react'
import SafeplaceInteraction from '../ColumLocation/ColumnLink/ColumnLink'

const Shelter = ({ object }: { object: THREE.Object3D }) => {
  const saveOnBoardingPOI = useSavePOIData(SafeplacePOI.OnBoarding)
  const saveInsidePOI = useSavePOIData(SafeplacePOI.Inside)
  const saveResourcesPOI = useSavePOIData(SafeplacePOI.Resources)

  const shelterRef = useRef<THREE.Object3D>()

  const [
    shelterRessourcesCam,
    shelterInsideCam,
    shelterOutsideCam,
    shelterMesh,
  ] = useMemo(() => object.children, [])

  const onBoardingPOIObj = useMemo(
    () => shelterOutsideCam.getObjectByName('shelter_outside_cam_Orientation'),
    []
  )
  const insidePOIObj = useMemo(
    () => shelterInsideCam.getObjectByName('shelter_inside_cam_Orientation'),
    []
  )

  const resourcesPOIObj = useMemo(
    () =>
      shelterRessourcesCam.getObjectByName('shelter_bookcase_cam_Orientation'),
    []
  )

  const isPOIAvailable = useSafeplaceStore((s) =>
    s.isCurrentlyAvailable(SafeplacePOI.Inside)
  )

  useEffect(() => {
    if (onBoardingPOIObj === undefined)
      throw 'OnBoarding POI not found, check GLTF file'
    saveOnBoardingPOI(onBoardingPOIObj)

    if (insidePOIObj === undefined)
      throw 'Inside POI not found, check GLTF file'
    saveInsidePOI(insidePOIObj)

    if (resourcesPOIObj === undefined)
      throw 'Resources POI not found, check GLTF file'
    saveResourcesPOI(resourcesPOIObj)
  }, [])

  return (
    <primitive ref={shelterRef} object={object}>
      {isPOIAvailable && (
        <SafeplaceInteraction
          position={insidePOIObj?.position.toArray()}
          safeplacePOI={SafeplacePOI.Inside}
        />
      )}
    </primitive>
  )
}

export default Shelter
