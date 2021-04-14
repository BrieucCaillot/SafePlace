import { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'

import { SafeplacePOI } from '@/stores/useSafeplaceStore'
import Shelter from '@/components/Safeplace/Canvas/Shelter/Shelter'
import ColumnLocation from '@/components/Safeplace/Canvas/ColumLocation/ColumnLocation'
import Grass from './Decorations/Grass/Grass'

const SafeplaceModel = () => {
  const { scene } = useGLTF('/models/safeplace.glb')

  const [ground, trees, columns, shelter, bridge] = useMemo(
    () => scene.children,
    []
  )

  const columnAssoc: { [name: string]: SafeplacePOI } = {
    column_group_1: SafeplacePOI.MountainPedestal,
    column_group_2: SafeplacePOI.PlaceholderPedetral1,
    column_group_3: SafeplacePOI.PlaceholderPedetral2,
    column_group_4: SafeplacePOI.PlaceholderPedetral3,
    column_group_5: SafeplacePOI.PlaceholderPedetral4,
  }

  return (
    <>
      <Shelter object={shelter} />

      {columns.children.map((o) => (
        <ColumnLocation
          safeplacePOI={columnAssoc[o.name]}
          onClick={() => console.log(columnAssoc[o.name])}
          columnObj={o}
          key={o.name}
        />
      ))}

      <primitive object={bridge} />
      <primitive object={trees} />
      <primitive object={ground} />
      <Grass>
        {(ref) => <primitive object={ground.children[1]} ref={ref} />}
      </Grass>
    </>
  )
}

export default SafeplaceModel
