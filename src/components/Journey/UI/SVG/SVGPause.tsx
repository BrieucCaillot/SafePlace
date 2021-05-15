const SVGPause = ({ className }: { className?: string }) => {
  return (
    <svg
      className={`text-white transform-gpu scale-125 ${className}`}
      width='8'
      height='12'
      viewBox='0 0 8 12'
      fill='none'
    >
      <path
        d='M1 0C0.447715 0 0 0.447715 0 1V11C0 11.5523 0.447715 12 1 12C1.55228 12 2 11.5523 2 11V1C2 0.447715 1.55228 0 1 0Z'
        fill='currentColor'
      ></path>
      <path
        d='M7 0C6.44772 0 6 0.447715 6 1V11C6 11.5523 6.44772 12 7 12C7.55228 12 8 11.5523 8 11V1C8 0.447715 7.55228 0 7 0Z'
        fill='currentColor'
      ></path>
    </svg>
  )
}

export default SVGPause
