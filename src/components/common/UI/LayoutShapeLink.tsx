import { ReactNode } from 'react'

const LayoutShapeLink = ({
  children,
  className,
}: {
  children: ReactNode
  className: string
}) => {
  return (
    <div
      className={`shape shape-link ${className} pointer-events-auto relative cursor-pointer`}
    >
      {children}
    </div>
  )
}

export default LayoutShapeLink
