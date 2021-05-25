import Routes from '@/constants/enums/Routes'
import { folder, useControls } from 'leva'
import { ComponentProps, useMemo } from 'react'
import * as THREE from 'three'
import Water from './Water'

const WaterParams = ({
  controlsName = null,
  route = null,
  waterParams = {
    textureScale: 3.2,
    flowSpeed: 0.05,
    flowDirection: 0.2,
    flowIntensity: 0.04,
    hslTransform: { x: 1.06, y: 0.5, z: 1.06 },
  },
  textureName = '',
  ...props
}: Omit<ComponentProps<typeof Water>, 'waterParams'> & {
  waterParams?: Partial<ComponentProps<typeof Water>['waterParams']>
  textureName?: string
  controlsName?: string
  route?: Routes
}) => {
  const controledParams = useControls(
    controlsName || 'water',
    {
      textureScale: waterParams.textureScale,
      flowSpeed: waterParams.flowSpeed,
      flowDirection: { value: waterParams.flowDirection, min: 0, max: Math.PI },
      flowIntensity: waterParams.flowIntensity,
      hslTransform: waterParams.hslTransform,
    },
    {
      collapsed: true,
      render: (s) => route === null || s('path') === route,
    }
  )

  return <Water waterParams={controledParams} {...props} />
}

export default WaterParams
