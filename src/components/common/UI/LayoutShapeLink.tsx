import { ReactNode } from 'react'
import Link from 'next/link'

import Routes from '@/constants/enums/Routes'

const LayoutShapeLink = ({
  children,
  className,
  route = Routes.Resources,
}: {
  children: ReactNode
  className?: string
  route?: Routes
}) => {
  return (
    <Link href={route} as={route}>
      <div className='fadeIn'>
        <button
          className={`shape shape-link ${className} pointer-events-auto outline-none focus:outline-none relative cursor-pointer`}
        >
          {children}
        </button>
      </div>
    </Link>
  )
}

export default LayoutShapeLink
