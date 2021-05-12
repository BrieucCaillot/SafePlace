import { ReactNode } from 'react'

const ButtonBlob = ({
  children,
  onClick,
}: {
  children: ReactNode
  onClick: Function
}) => {
  const handleOnClick = () => {
    onClick()
  }

  return (
    <div
      onClick={handleOnClick}
      className='shape shape-blob pointer-events-auto relative cursor-pointer'
    >
      {children}
    </div>
  )
}

export default ButtonBlob
