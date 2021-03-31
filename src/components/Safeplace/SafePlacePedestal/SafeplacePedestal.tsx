import { useMemo, useRef } from 'react'
import useSafeplaceStore, { SafeplacePOI } from '@/stores/useSafeplaceStore'
import useSavePOIData from '@/hooks/POI/useSavePOIData'
import SafeplaceInteraction from '@/components/Safeplace/SafeplaceInteraction/SafeplaceInteraction'

const SafeplacePedestal = ({ safeplacePOI, pedestalObj }) => {
  const isCurrentlyAvailable = useSafeplaceStore(
    (state) => state.isCurrentlyAvailable
  )

  const camera = useMemo(() => pedestalObj.children[0], [])
  const pedestal = useMemo(() => pedestalObj.children[1], [])

  const cameraRef = useRef<THREE.Object3D>(null)
  const savePOI = useSavePOIData(safeplacePOI)

  return (
    <group position={pedestalObj.position} scale={pedestalObj.scale}>
      {isCurrentlyAvailable(safeplacePOI) && (
        <SafeplaceInteraction safeplacePOI={safeplacePOI} />
      )}
      <mesh
        ref={savePOI}
        name={camera.name}
        position={camera.position}
        rotation={camera.rotation}
        scale={camera.scale}
      />
      <mesh
        name={pedestal.name}
        position={pedestal.position}
        scale={pedestal.scale}
        material={pedestal.material}
        geometry={pedestal.geometry}
      />
    </group>
  )
}

export default SafeplacePedestal
