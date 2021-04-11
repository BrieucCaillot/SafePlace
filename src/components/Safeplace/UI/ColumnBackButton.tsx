import useSafeplaceStore, { SafeplacePOI } from '@/stores/useSafeplaceStore'

const ColumnBackButton = () => {
  const POIsWhereHidden = [
    SafeplacePOI.Inside,
    SafeplacePOI.OnBoarding,
    SafeplacePOI.Resources,
    SafeplacePOI.ResourceFocused,
  ]
  const showButton = useSafeplaceStore(
    (state) => !POIsWhereHidden.includes(state.currentPOI)
  )
  const setCurrentPOI = useSafeplaceStore((state) => state.setCurrentPOI)

  return (
    <div
      className={`${
        showButton ? 'block' : 'hidden'
      } pointer-events-auto cursor-pointer`}
      onClick={() => setCurrentPOI(SafeplacePOI.Inside)}
    >
      <p className='text-white text-2xl'>Abris</p>
    </div>
  )
}

export default ColumnBackButton
