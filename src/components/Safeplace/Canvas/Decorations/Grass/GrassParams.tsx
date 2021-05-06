import Routes from '@/constants/enums/Routes'
import { useControls } from 'leva'
import { ComponentProps, useMemo } from 'react'
import * as THREE from 'three'
import Grass from './Grass'

const GrassParams = ({
  controlsName = null,
  route = null,
  ...props
}: Omit<ComponentProps<typeof Grass>, 'grassParams'> & {
  controlsName?: string
  route?: Routes
}) => {
  const textures = useMemo(() => {
    const loaders = new THREE.TextureLoader()
    return {
      grass_1: loaders.load('/img/common/greenery/grass_1.png'),
      grass_2: loaders.load('/img/common/greenery/grass_2.png'),
      grass_3: loaders.load('/img/common/greenery/grass_3.png'),
    }
  }, [])

  const grassParams = useControls(
    controlsName || 'grass',
    {
      texture: { value: textures['grass_2'], options: textures },
      amount: { value: 24576, step: 1 },
      size: 0.4,
      windNoiseSize: { value: 0.2, min: 0, max: 1 },
      windAmplitude: { value: 0.07, min: 0, max: 1 },
      windSpeed: 0.2,
    },
    {
      collapsed: true,
      render: (s) => route === null || s('path') === route,
    }
  )

  return <Grass grassParams={grassParams} {...props} />
}

export default GrassParams
