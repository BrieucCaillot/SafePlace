import Routes from '@/constants/enums/Routes'
import { folder, useControls } from 'leva'
import { ComponentProps, useMemo } from 'react'
import * as THREE from 'three'
import Grass from './Grass'

const GrassParams = ({
  controlsName = null,
  folderName = null,
  route = null,
  grassParams = {},
  textureName = '',
  ...props
}: Omit<ComponentProps<typeof Grass>, 'grassParams'> & {
  grassParams?: Partial<ComponentProps<typeof Grass>['grassParams']>
  textureName?: string
  controlsName?: string
  folderName?: string
  route?: Routes
}) => {
  const textures = useMemo<{ [name: string]: THREE.Texture }>(() => {
    const loaders = new THREE.TextureLoader()
    return {
      grass_1: loaders.load('/img/common/greenery/grass_1.png'),
      grass_2: loaders.load('/img/common/greenery/grass_2.png'),
      grass_3: loaders.load('/img/common/greenery/grass_3.png'),
      grass_4: loaders.load('/img/common/greenery/grass_4.png'),
      grass_5: loaders.load('/img/common/greenery/grass_5.png'),
      grass_chapter_1: loaders.load('/img/common/greenery/grass_chapter_1.png'),
    }
  }, [])

  const controledParams = useControls(folderName || 'greenery', {
    [controlsName || 'grass']: folder(
      {
        texture: {
          value:
            grassParams.texture || textures[textureName] || textures['grass_4'],
          options: textures,
        },
        amount: { value: grassParams.amount || 24576, step: 1 },
        size: grassParams.size || 0.4,
        windNoiseSize: {
          value: grassParams.windNoiseSize || 0.2,
          min: 0,
          max: 1,
        },
        windAmplitude: {
          value: grassParams.windAmplitude || 0.07,
          min: 0,
          max: 1,
        },
        windSpeed: grassParams.windSpeed || 0.2,
        weightAttribute: grassParams.weightAttribute || 'grassWeight',
      },
      {
        collapsed: true,
        render: (s) => route === null || s('path') === route,
      }
    ),
  })

  return <Grass grassParams={controledParams} {...props} />
}

export default GrassParams
