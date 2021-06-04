import Routes from '@/constants/enums/Routes'
import SceneName from '@/constants/enums/SceneName'
import useSceneStore from '@/stores/useSceneStore'
import { folder, useControls } from 'leva'
import { useEffect } from 'react'
import * as THREE from 'three'

const useSceneControls = (sceneName: SceneName, route: Routes = null) => {
  const scene = useSceneStore((s) => s.scenesData[sceneName].scene)

  const { color, density, enabled } = useControls(
    `${sceneName.toLowerCase()}`,
    {
      fog: folder(
        {
          enabled: scene.fog !== null,
          color:
            (scene.fog as THREE.FogExp2)?.color.getHexString() || '#000000',
          density: {
            value: (scene.fog as THREE.FogExp2)?.density || 0,
            min: 0,
            max: 0.1,
          },
        },
        { collapsed: true }
      ),
    },
    { collapsed: true, render: (s) => route === null || s('path') === route }
  )

  useEffect(() => {
    scene.fog = enabled ? new THREE.FogExp2(color, density) : null
  }, [color, density, enabled])
}

export default useSceneControls
