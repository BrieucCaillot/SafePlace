import React from 'react'
import { ReactNode } from 'react'

const LayoutBottom = ({ children }: { children: ReactNode }) => {
  return (
    <div
      id='layout-bottom'
      className='absolute bottom-0 left-0 w-full px-5 md:px-14 mb-5 flex items-center justify-between'
    >
      {children}
    </div>
  )
}

export default LayoutBottom
