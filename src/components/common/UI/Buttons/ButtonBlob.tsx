import { ReactNode } from 'react'

const ButtonBlob = ({
  children,
  onClick,
}: {
  children: ReactNode
  onClick?: Function
}) => {
  return (
    <div
      onClick={onClick ? () => onClick() : null}
      className='shape shape-blob pointer-events-auto relative cursor-pointer'
    >
      {children}
    </div>
  )
}

export default ButtonBlob
