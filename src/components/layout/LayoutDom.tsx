import Header from '@/components/common/Header'

const LayoutDom = ({ dom }) => {
  return (
    <div className='absolute top-0 left-0 right-0 z-20 dom'>
      <Header />
      {dom}
    </div>
  )
}

export default LayoutDom
