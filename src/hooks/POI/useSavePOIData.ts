import useSafeplaceStore from '@/stores/useSafeplaceStore'
import SafeplacePOI from 'constants/enums/SafeplacePOI'
import { useCallback, useEffect } from 'react'
import * as THREE from 'three'

function useSavePOIData(key: SafeplacePOI): (objRef: THREE.Object3D) => void
function useSavePOIData(key: SafeplacePOI, object: THREE.Object3D): void
function useSavePOIData(
  key: SafeplacePOI,
  object: THREE.Object3D | null | undefined | false = false
) {
  const setPOIData = useSafeplaceStore((s) => s.setPOIData)
  if (object === false) {
    const refCallback = useCallback((objRef: THREE.Object3D) => {
      if (objRef === null) return
      setPOIData(key, {
        position: objRef.getWorldPosition(new THREE.Vector3()),
        quaternion: objRef.getWorldQuaternion(new THREE.Quaternion()),
        scale: objRef.getWorldScale(new THREE.Vector3()),
      })
    }, [])
    return refCallback
  }

  useEffect(() => {
    if (object === null || object === undefined) return
    setPOIData(key, {
      position: object.getWorldPosition(new THREE.Vector3()),
      quaternion: object.getWorldQuaternion(new THREE.Quaternion()),
      scale: object.getWorldScale(new THREE.Vector3()),
    })
  }, [object])
}

export default useSavePOIData
