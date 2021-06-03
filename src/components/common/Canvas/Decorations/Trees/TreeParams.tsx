import * as THREE from 'three'
import { folder, useControls } from 'leva'

import Tree from '@/components/common/Canvas/Decorations/Trees/Tree'
import { ComponentProps } from 'react'
import Routes from '@/constants/enums/Routes'

const TreeParams = ({
  controlsName = null,
  folderName = null,
  route = null,
  treeParams = {},
  ...props
}: Omit<ComponentProps<typeof Tree>, 'treeParams'> & {
  treeParams?: Partial<ComponentProps<typeof Tree>['treeParams']>
  controlsName?: string
  folderName?: string
  route?: Routes
}) => {
  const controledParams = useControls(folderName || 'greenery', {
    [controlsName || 'tree']: folder(
      {
        uWindNoiseSize: {
          value: treeParams.uWindNoiseSize || 2.1,
          min: 0,
          max: 10,
        },
        uWindSpeed: {
          value: treeParams.uWindSpeed || 3.3,
          min: 0,
          max: 10,
        },
        uWindAmplitude: {
          value: treeParams.uWindAmplitude || 0.7,
          min: 0,
          max: 10,
        },
      },
      { collapsed: true, render: (s) => route === null || s('path') === route }
    ),
  })

  return <Tree treeParams={controledParams} {...props} />
}

export default TreeParams
