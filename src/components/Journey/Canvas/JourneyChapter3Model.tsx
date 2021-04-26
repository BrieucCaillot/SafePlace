import { useEffect, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'

import { SafeplacePOI } from '@/stores/useSafeplaceStore'
import Shelter from '@/components/Safeplace/Canvas/Shelter/Shelter'
import ColumnLocation from '@/components/Safeplace/Canvas/ColumLocation/ColumnLocation'
import Grass from '@/components/Safeplace/Canvas/Decorations/Grass/Grass'
import { useThree } from 'react-three-fiber'

const JourneyChapter3Model = () => {
  const { scene } = useGLTF('/models/journey/chapter3.glb')

  return (
    <>
      <primitive object={scene} />
      <spotLight position={[0, 10, 0]} intensity={10} />
    </>
  )
}

export default JourneyChapter3Model
