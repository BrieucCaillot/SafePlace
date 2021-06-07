const SVGSoundOff = () => {
  return (
    <svg
      className='text-white transform-gpu scale-75 pointer-events-none'
      width='64'
      height='37'
      viewBox='0 0 64 37'
      shapeRendering='geometricPrecision'
      textRendering='geometricPrecision'
      fill='none'
    >
      <path
        stroke='currentColor'
        strokeWidth='4'
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <animate
          repeatCount='indefinite'
          attributeName='d'
          dur='1.5s'
          values='M2 22.9396C3.25 22.9396 8.8921 24.0401 11.3921 24.0401C13.8921 24.0401 17.4901 21.8833 21.2401 21.8833C24.9901 21.8833 28.25 25.0009 32 25.0009C35.75 25.0009 39.25 21.8828 43 21.8828C46.75 21.8828 48.5 24.0401 53.5 24.0401C57.5 24.0401 59.5 22.9396 62 22.9396;
 '
        ></animate>
      </path>
    </svg>
  )
}

export default SVGSoundOff
