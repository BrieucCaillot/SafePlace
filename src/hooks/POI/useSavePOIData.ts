import useSafeplaceStore, { SafeplacePOI } from '@/stores/useSafeplaceStore'
import { useCallback } from 'react'
import * as THREE from 'three'

const useSavePOIData = (key: SafeplacePOI) => {
  const setPOIData = useSafeplaceStore((s) => s.setPOIData)
  const refCallback = useCallback((object: THREE.Object3D) => {
    // console.log(object)

    setPOIData(key, {
      position: object.getWorldPosition(new THREE.Vector3()),
      quaternion: object.getWorldQuaternion(new THREE.Quaternion()),
      scale: object.getWorldScale(new THREE.Vector3()),
    })
  }, [])

  return refCallback
}

export default useSavePOIData
