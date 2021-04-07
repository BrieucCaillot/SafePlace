const LayoutDom = ({ dom }) => {
  return (
    <div className='dom font-serif relative h-screen w-screen z-10 pointer-events-none'>
      {dom}
    </div>
  )
}

export default LayoutDom
