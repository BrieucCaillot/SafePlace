import { useMemo, useRef } from 'react'
import { useRouter } from 'next/router'

import useSafeplaceStore, { SafeplacePOI } from '@/stores/useSafeplaceStore'
import useSavePOIData from '@/hooks/POI/useSavePOIData'
import ColumnLink from '@/components/Safeplace/Canvas/ColumLocation/ColumnLink/ColumnLink'

const ColumnLocation = ({
  safeplacePOI,
  pedestalObj,
}: {
  safeplacePOI: SafeplacePOI
  pedestalObj: THREE.Object3D
}) => {
  // TODO: Have a look to this component
  // const router = useRouter()

  const isCurrentlyAvailable = useSafeplaceStore((state) =>
    state.isCurrentlyAvailable(safeplacePOI)
  )

  const camera = useMemo(() => pedestalObj.children[0], [])
  const pedestal = useMemo(() => pedestalObj.children[1] as THREE.Mesh, [])

  // const cameraRef = useRef<THREE.Object3D>(null)
  const savePOI = useSavePOIData(safeplacePOI)

  const onPedestalClick = () => {
    if (safeplacePOI !== SafeplacePOI.MountainPedestal) return
    // Not working
    // router.push('/journeys/mountain')
  }

  return (
    <group position={pedestalObj.position} scale={pedestalObj.scale}>
      {isCurrentlyAvailable && <ColumnLink safeplacePOI={safeplacePOI} />}
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
        onClick={onPedestalClick}
      />
    </group>
  )
}

export default ColumnLocation
