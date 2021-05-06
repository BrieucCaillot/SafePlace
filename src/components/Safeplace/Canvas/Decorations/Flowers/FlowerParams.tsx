import Routes from '@/constants/enums/Routes'
import { useControls } from 'leva'
import { ComponentProps, useMemo } from 'react'
import * as THREE from 'three'
import Flowers from './Flowers'

const FlowersParams = ({
  controlsName = null,
  route = null,
  ...props
}: Omit<ComponentProps<typeof Flowers>, 'flowerParams'> & {
  controlsName?: string
  route?: Routes
}) => {
  const textures = useMemo(() => {
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

  const flowerParams = useControls(
    controlsName || 'flowers',
    {
      texture: { value: textures['red_flower'], options: textures },
      amount: { value: 2048, step: 1 },
      size: 3,
    },
    {
      collapsed: true,
      render: (s) => route === null || s('path') === route,
    }
  )

  return <Flowers flowersParams={flowerParams} {...props} />
}

export default FlowersParams
