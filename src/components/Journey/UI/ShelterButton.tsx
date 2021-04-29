import LayoutShapeLink from '@/components/common/UI/LayoutShapeLink'
import useSafeplaceStore, { SafeplacePOI } from '@/stores/useSafeplaceStore'
import Link from 'next/link'

const ShelterButton = () => {
  return (
    <LayoutShapeLink className='shape-link__shelter'>
      <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer'>
        <Link href='/safeplace'>
          <a className='text-white text-2xl'>Abris</a>
        </Link>
      </div>
    </LayoutShapeLink>
  )
}

export default ShelterButton
