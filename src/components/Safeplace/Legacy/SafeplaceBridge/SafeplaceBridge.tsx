import { useCallback, useEffect, useMemo } from 'react'
import * as THREE from 'three'
import useSavePOIData from '@/hooks/POI/useSavePOIData'
import { SafeplacePOI } from '@/stores/useSafeplaceStore'

const SafeplaceBridge = ({
  safeplacePOI,
  bridge,
}: {
  safeplacePOI: SafeplacePOI
  bridge: THREE.Object3D[]
}) => {
  const aboutCam = useMemo(() => bridge[0], [])
  const bridgeCam = useMemo(() => bridge[1] as THREE.Mesh, [])
  const bridgeMesh = useMemo(() => bridge[2] as THREE.Mesh, [])

  const savePOIAbout = useSavePOIData(SafeplacePOI.About)
  const savePOIBridge = useSavePOIData(safeplacePOI)

  useEffect(() => {
    savePOIAbout(aboutCam)
    savePOIBridge(bridgeCam)
  }, [bridgeCam])

  return (
    <group>
      <mesh
        name={bridgeMesh.name}
        position={bridgeMesh.position}
        rotation={bridgeMesh.rotation}
        scale={bridgeMesh.scale}
        material={bridgeMesh.material}
        geometry={bridgeMesh.geometry}
      />
    </group>
  )
}

export default SafeplaceBridge
