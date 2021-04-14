import React, { ReactNode, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

const PortalUI = ({
  children,
  selector,
}: {
  children: ReactNode
  selector: string
}) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  return mounted
    ? createPortal(children, document.querySelector(selector)!)
    : null
}

export default PortalUI
