import useSafeplaceStore, { SafeplacePOI } from '@/stores/useSafeplaceStore'

const InsideButton = () => {
  const showButton = useSafeplaceStore(
    (state) => state.currentPOI === SafeplacePOI.Resources
  )
  const setCurrentPOI = useSafeplaceStore((state) => state.setCurrentPOI)

  return (
    <div
      className={`${
        showButton ? 'block' : 'hidden'
      } pointer-events-auto cursor-pointer`}
      onClick={() => setCurrentPOI(SafeplacePOI.Inside)}
    >
      <p className='text-white text-2xl pr-10'>Abris</p>
    </div>
  )
}

export default InsideButton
