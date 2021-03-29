import Header from '@/components/common/Header'

const LayoutDom = ({ dom }) => {
  return (
    <div className='dom relative h-screen w-screen z-10 pointer-events-none'>
      <Header />
      {dom}
    </div>
  )
}

export default LayoutDom
