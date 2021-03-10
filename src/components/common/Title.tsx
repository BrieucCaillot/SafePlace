const Title = ({ title }) => {
  return (
    <div className='z-20 flex justify-center w-full'>
      <span className='inline-block p-4 text-center text-white focus:outline-none focus:ring'>
        {title}
      </span>
    </div>
  )
}

export default Title
