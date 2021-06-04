import { useEffect } from 'react'
import { useControls } from 'leva'

import useSafeplaceStore from '@/stores/useSafeplaceStore'
import SafeplacePOI from '@/constants/enums/SafeplacePOI'
import Routes from '@/constants/enums/Routes'
import useSceneControls from '@/hooks/three/useSceneControls'
import SceneName from '@/constants/enums/SceneName'

const SafeplaceDebug = (): null => {
  const statePOI = useSafeplaceStore((state) => state.currentPOI)
  const setCurrentPOI = useSafeplaceStore((state) => state.setCurrentPOI)

  useSceneControls(SceneName.Safeplace, Routes.Safeplace)

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

  return null
}

export default SafeplaceDebug
