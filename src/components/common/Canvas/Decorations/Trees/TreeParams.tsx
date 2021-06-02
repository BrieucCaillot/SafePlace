import * as THREE from 'three'
import { folder, useControls } from 'leva'

import Tree from '@/components/common/Canvas/Decorations/Trees/Tree'

const TreeParams = ({ tree, ...props }: { tree: THREE.Mesh }) => {
  const controledParams = useControls('greenery', {
    trees: folder(
      {
        uWindNoiseSize: {
          value: 2.1,
          min: 0,
          max: 10,
        },
        uWindSpeed: {
          value: 3.3,
          min: 0,
          max: 10,
        },
        uWindAmplitude: {
          value: 0.7,
          min: 0,
          max: 10,
        },
      },
      { collapsed: true }
    ),
  })

  return <Tree treeParams={controledParams} tree={tree} {...props} />
}

export default TreeParams
