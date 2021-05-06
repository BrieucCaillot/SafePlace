import Routes from '@/constants/enums/Routes'
import { folder, useControls } from 'leva'
import { ComponentProps, useMemo } from 'react'
import * as THREE from 'three'
import Flowers from './Flowers'

const FlowersParams = ({
  controlsName = null,
  folderName = null,
  route = null,
  flowersParams = {},
  textureName = '',
  ...props
}: Omit<ComponentProps<typeof Flowers>, 'flowersParams'> & {
  flowersParams?: Partial<ComponentProps<typeof Flowers>['flowersParams']>
  textureName?: string
  controlsName?: string
  folderName?: string
  route?: Routes
}) => {
  const textures = useMemo<{ [name: string]: THREE.Texture }>(() => {
    const loaders = new THREE.TextureLoader()
    return {
      blue_flower: loaders.load(
        '/img/common/greenery/blue_flower.png',
        (t) => (t.flipY = false)
      ),
      red_flower: loaders.load(
        '/img/common/greenery/red_flower.png',
        (t) => (t.flipY = false)
      ),
    }
  }, [])

  const controledParams = useControls(folderName || 'greenery', {
    [controlsName || 'flowers']: folder(
      {
        texture: {
          value:
            flowersParams.texture ||
            textures[textureName] ||
            textures['red_flower'],
          options: textures,
        },
        amount: { value: flowersParams.amount || 2048, step: 1 },
        size: flowersParams.size || 3,
        weightAttribute: flowersParams.weightAttribute || 'flowerWeight1',
      },
      {
        collapsed: true,
        render: (s) => route === null || s('path') === route,
      }
    ),
  })

  return <Flowers flowersParams={controledParams} {...props} />
}

export default FlowersParams
