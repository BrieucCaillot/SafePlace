const SVGSoundOff = ({ className = '' }: { className?: string }) => {
  return (
    <svg
      className={`text-white transform-gpu scale-150 ${className}`}
      width='18'
      height='12'
      viewBox='0 0 18 3'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <animate
          repeatCount='indefinite'
          attributeName='d'
          dur='1.5s'
          values='M18 2C15 2 15.5 1 13.5 1C11.5 1 11 2 9.3705 2C7.74101 2 7.51391 1 5.5 1C3.48609 1 3.6 2 1 2;
 '
        ></animate>
      </path>
    </svg>
  )
}

export default SVGSoundOff
