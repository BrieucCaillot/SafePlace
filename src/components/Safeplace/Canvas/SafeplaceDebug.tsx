import useSafeplaceStore from '@/stores/useSafeplaceStore'
import SafeplacePOI from 'constants/enums/SafeplacePOI'
import { useControls } from 'leva'
import { useEffect } from 'react'

const SafeplaceDebug = (): null => {
  const statePOI = useSafeplaceStore((state) => state.currentPOI)
  const setCurrentPOI = useSafeplaceStore((state) => state.setCurrentPOI)

  /**
   * Debug
   */
  const [{ currentPOI }, set] = useControls('safeplace', () => ({
    currentPOI: {
      value: statePOI,
      options: SafeplacePOI,
    },
  }))

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
