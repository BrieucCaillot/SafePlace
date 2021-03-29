import { useEffect } from 'react'
import useSafeplaceStore from '@/stores/useSafeplaceStore'

const SafeplacePedestal = ({ safeplacePOI, pedestalObj }) => {
  const setCurrentPOI = useSafeplaceStore((state) => state.setCurrentPOI)
  const setPOIData = useSafeplaceStore((state) => state.setPOIData)

  /**
   * SET PEDESTRAL POI
   */
  useEffect(() => {
    setPOIData(safeplacePOI, {
      position: pedestalObj.position,
    })
  }, [])

  /**
   * SET CURRENT POI ON CLICK
   */
  const onClick = () => {
    setCurrentPOI(safeplacePOI)
  }

  return (
    <mesh
      name={pedestalObj.name}
      material={pedestalObj.material}
      geometry={pedestalObj.geometry}
      position={pedestalObj.position}
      scale={pedestalObj.scale}
      onClick={onClick}
    />
  )
}

export default SafeplacePedestal
