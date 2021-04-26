import LayoutShapeLink from '@/components/common/UI/LayoutShapeLink'
import useSafeplaceStore, { SafeplacePOI } from '@/stores/useSafeplaceStore'
import Link from 'next/link'

const SafeplaceButton = () => {
  return (
    <LayoutShapeLink className='shape-link__shelter'>
      <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer'>
        <Link href='/safeplace'>
          <p className='text-primary text-2xl'>Abris</p>
        </Link>
      </div>
    </LayoutShapeLink>
  )
}

export default SafeplaceButton
