const SVGReturn = ({ className }: { className?: string }) => {
  return (
    <svg
      width='25'
      height='25'
      viewBox='0 0 25 25'
      fill='none'
      className='pointer-events-none'
    >
      <path
        d='M8.50012 5.5L3.85156 10.2114L8.50012 15'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M3.85156 10.2114H11.8516C19.5001 10.2114 21.8516 13 21.8516 20.2114V21.2114'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  )
}

export default SVGReturn
