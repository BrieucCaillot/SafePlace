import { ReactNode } from 'react'

const LayoutDom = ({ dom }: { dom: ReactNode }) => {
  return (
    <div className='dom font-serif relative h-screen w-screen z-10 pointer-events-none'>
      {dom}
    </div>
  )
}

export default LayoutDom
