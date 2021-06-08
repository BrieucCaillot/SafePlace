import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { useControls } from 'leva'

const CURSOR_SIZE = 20

const Cursor = () => {
  const cursorRef = useRef<HTMLDivElement>()

  const mousePos = useRef(new THREE.Vector2())

  const [hovering, setHovering] = useState(false)

  const { customCursor } = useControls({
    customCursor: true,
  })

  useEffect(() => {
    customCursor
      ? document.body.classList.add('cursor-none')
      : document.body.classList.remove('cursor-none')

    if (!customCursor) return

    const handleMouse = (e: MouseEvent) => {
      const { clientX, clientY } = e

      mousePos.current.set(
        clientX - window.innerWidth / 2 - CURSOR_SIZE / 2,
        clientY - window.innerHeight / 2 - CURSOR_SIZE / 2
      )
      cursorRef.current.style.transform = `translate3D(${mousePos.current.x}px, ${mousePos.current.y}px, 0)`

      !hovering &&
      (e.target as HTMLElement).classList.length > 0 &&
      (e.target as HTMLElement).classList.contains('cursor-pointer')
        ? setHovering(true)
        : setHovering(false)
    }

    window.addEventListener('mousemove', handleMouse)
    return () => window.removeEventListener('mousemove', handleMouse)
  }, [customCursor])

  return (
    <div
      ref={cursorRef}
      id='cursor'
      className={`absolute top-screen-h/2 left-screen-w/2 pointer-events-none h-10 w-10 ${
        hovering ? 'is-hovering' : ''
      }`}
    >
      <div className='cursor cursor__default absolute'></div>
      <div className='cursor cursor__pointer absolute'></div>
    </div>
  )
}

export default Cursor
