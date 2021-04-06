import useSafeplaceStore, { SafeplacePOI } from '@/stores/useSafeplaceStore'
import { useMemo } from 'react'

const GoBackBottom = () => {
  const currentPOI = useSafeplaceStore((state) => state.currentPOI)
  const setCurrentPOI = useSafeplaceStore((state) => state.setCurrentPOI)

  const showGoBackButton = useMemo(() => {
    return (
      currentPOI !== SafeplacePOI.Bridge &&
      currentPOI !== SafeplacePOI.OnBoarding &&
      currentPOI !== SafeplacePOI.Inside
    )
  }, [currentPOI])

  return (
    <div
      className={`${
        showGoBackButton ? 'block' : 'hidden'
      } pointer-events-auto relative -left-32 -bottom-32 bg-blue-500 rounded-full h-60 w-60 text-center cursor-pointer`}
      onClick={() => setCurrentPOI(SafeplacePOI.Inside)}
    >
      <p className='absolute top-10 right-8 text-white text-2xl'>Abris</p>
    </div>
  )
}

export default GoBackBottom
