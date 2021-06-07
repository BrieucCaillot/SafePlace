import { ReactNode } from 'react'
import Link from 'next/link'

import Routes from '@/constants/enums/Routes'

const ButtonShapeLink = ({
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
      <button
        className={`shape shape-link ${className} pointer-events-auto outline-none focus:outline-none relative cursor-pointer`}
      >
        <span className='block w-full text-xl pointer-events-none'>
          {children}
        </span>
      </button>
    </Link>
  )
}

export default ButtonShapeLink
