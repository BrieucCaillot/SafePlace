import { useMemo, useRef } from 'react'
import mergeRefs from 'react-merge-refs'
import useSafeplaceStore, { SafeplacePOI } from '@/stores/useSafeplaceStore'
import useSavePOIData from '@/hooks/POI/useSavePOIData'

const SafeplacePedestal = ({ safeplacePOI, pedestalObj }) => {
  const currentPOI = useSafeplaceStore((state) => state.currentPOI)
  const setCurrentPOI = useSafeplaceStore((state) => state.setCurrentPOI)
  const setPOIData = useSafeplaceStore((state) => state.setPOIData)

  const camera = useMemo(() => pedestalObj.children[0], [])
  const pedestral = useMemo(() => pedestalObj.children[1], [])

  const cameraRef = useRef<THREE.Object3D>(null)
  const savePOI = useSavePOIData(safeplacePOI)

  /**
   * SET CURRENT POI ON CLICK
   */
  const onClick = () => {
    if (currentPOI == SafeplacePOI.Inside) setCurrentPOI(safeplacePOI)
  }

  return (
    <group position={pedestalObj.position} scale={pedestalObj.scale}>
      <mesh
        ref={savePOI}
        name={camera.name}
        position={camera.position}
        rotation={camera.rotation}
        scale={camera.scale}
        onClick={onClick}
      />
      <mesh
        name={pedestral.name}
        position={pedestral.position}
        scale={pedestral.scale}
        material={pedestral.material}
        geometry={pedestral.geometry}
        onClick={onClick}
      />
    </group>
  )
}

export default SafeplacePedestal
