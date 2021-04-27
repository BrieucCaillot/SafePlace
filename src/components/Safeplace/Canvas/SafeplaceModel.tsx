import { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'

import { SafeplacePOI } from '@/stores/useSafeplaceStore'
import Shelter from '@/components/Safeplace/Canvas/Shelter/Shelter'
import ColumnLocation from '@/components/Safeplace/Canvas/ColumLocation/ColumnLocation'
import Grass from '@/components/Safeplace/Canvas/Decorations/Grass/Grass'

const SafeplaceModel = () => {
  const { scene } = useGLTF('/models/safeplace/safeplace.glb')

  const [
    backgrounds,
    bridge_contain,
    cairns,
    columns,
    ark,
    flying_rocks,
    ground_contain,
    rocks,
    shelter,
    trees,
    water_contain,
  ] = useMemo(() => scene.children[0].children, [])

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

      <primitive object={backgrounds} />
      <primitive object={bridge_contain} />
      <primitive object={cairns} />
      <primitive object={trees} />
      <primitive object={ark} />
      <primitive object={flying_rocks} />
      <primitive object={rocks} />
      <primitive object={water_contain} />
      <primitive object={ground_contain} />
      {/* <Grass>
        {(ref) => <primitive object={ground_contain.children[1]} ref={ref} />}
      </Grass> */}
    </>
  )
}

export default SafeplaceModel
