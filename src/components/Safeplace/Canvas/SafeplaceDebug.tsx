import { useEffect } from 'react'
import { folder, useControls } from 'leva'
import * as THREE from 'three'

import useSafeplaceStore from '@/stores/useSafeplaceStore'
import SafeplacePOI from '@/constants/enums/SafeplacePOI'
import Routes from '@/constants/enums/Routes'
import useSceneStore from '@/stores/useSceneStore'
import SceneName from '@/constants/enums/SceneName'

const SafeplaceDebug = (): null => {
  const statePOI = useSafeplaceStore((state) => state.currentPOI)
  const setCurrentPOI = useSafeplaceStore((state) => state.setCurrentPOI)
  const { scene } = useSceneStore((s) => s.scenesData[SceneName.Safeplace])

  /**
   * Debug
   */
  const [{ currentPOI }, set] = useControls(
    'safeplace',
    () => ({
      currentPOI: {
        value: statePOI,
        options: SafeplacePOI,
      },
    }),
    { render: (s) => s('path') === Routes.Safeplace }
  )

  // const { color, density } = useControls('safeplace', {
  //   fog: folder({
  //     color: '#cce0ff',
  //     density: (scene.fog as THREE.FogExp2).density,
  //   }),
  // })

  useEffect(() => {
    setCurrentPOI(currentPOI)
  }, [currentPOI])
  useEffect(
    () =>
      useSafeplaceStore.subscribe(
        (n: SafeplacePOI) => set({ currentPOI: n }),
        (s) => s.currentPOI
      ),
    []
  )
  // useEffect(() => {
  //   ;(scene.fog as THREE.FogExp2).color = new THREE.Color(color)
  //   ;(scene.fog as THREE.FogExp2).density = density
  // }, [color, density])

  return null
}

export default SafeplaceDebug
