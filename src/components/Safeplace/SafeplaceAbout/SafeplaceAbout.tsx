import { useCallback, useEffect, useRef } from 'react'
import * as THREE from 'three'
import { Box } from '@react-three/drei'

import useSavePOIData from '@/hooks/POI/useSavePOIData'
import { SafeplacePOI } from '@/stores/useSafeplaceStore'

const SafeplaceAbout = ({ aboutCam }) => {
  const savePOIAbout = useSavePOIData(SafeplacePOI.About)

  useEffect(() => {
    savePOIAbout(aboutCam)
  }, [aboutCam])

  return null
}

export default SafeplaceAbout
