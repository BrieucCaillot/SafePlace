import React from 'react'

const ButtonJourneyCompleted = ({ onClick }: { onClick: () => void }) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: '75vh',
        left: '50vw',
        transform: 'translate(-50%, 0)',
      }}
    >
      <button
        onClick={onClick}
        className='shape shape-link shape-link__safeplace whitespace-nowrap px-6 py-3 text-primary pointer-events-auto outline-none focus:outline-none relative cursor-pointer'
      >
        <span className='block w-full text-xl'>Retour à l'abris</span>
      </button>
    </div>
  )
}

export default ButtonJourneyCompleted
