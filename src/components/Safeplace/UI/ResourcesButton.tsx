import useSafeplaceStore, { SafeplacePOI } from '@/stores/useSafeplaceStore'

const ResourcesButton = () => {
  const isCurrentlyAvailable = useSafeplaceStore((state) =>
    state.isCurrentlyAvailable(SafeplacePOI.Resources)
  )

  const setCurrentPOI = useSafeplaceStore((state) => state.setCurrentPOI)

  return (
    <div
      className={`${
        isCurrentlyAvailable ? 'block' : 'hidden'
      } pointer-events-auto cursor-pointer`}
      onClick={() => setCurrentPOI(SafeplacePOI.Resources)}
    >
      <p className='text-white text-2xl'>Resources</p>
    </div>
  )
}

export default ResourcesButton
