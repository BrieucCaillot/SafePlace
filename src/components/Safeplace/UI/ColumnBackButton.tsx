import useSafeplaceStore, { SafeplacePOI } from '@/stores/useSafeplaceStore'

const ColumnBackButton = () => {
  const POIsWhereHidden = [
    SafeplacePOI.Inside,
    SafeplacePOI.OnBoarding,
    SafeplacePOI.Bridge,
  ]
  const showButton = useSafeplaceStore(
    (state) => !POIsWhereHidden.includes(state.currentPOI)
  )
  const setCurrentPOI = useSafeplaceStore((state) => state.setCurrentPOI)

  return (
    <div id='bottom' className='absolute bottom-0 left-0 w-full'>
      <div className='relative w-full'>
        <div
          className={`${
            showButton ? 'block' : 'hidden'
          } pointer-events-auto relative -left-32 -bottom-32 bg-blue-500 rounded-full h-60 w-60 text-center cursor-pointer`}
          onClick={() => setCurrentPOI(SafeplacePOI.Inside)}
        >
          <p className='absolute top-10 right-8 text-white text-2xl'>Abris</p>
        </div>
      </div>
    </div>
  )
}

export default ColumnBackButton
