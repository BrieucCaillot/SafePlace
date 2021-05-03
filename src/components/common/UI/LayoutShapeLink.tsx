import { ReactNode } from 'react'

const LayoutShapeLink = ({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) => {
  return (
    <button
      className={`shape shape-link ${className} pointer-events-auto outline-none focus:outline-none relative cursor-pointer`}
    >
      {children}
    </button>
  )
}

export default LayoutShapeLink
