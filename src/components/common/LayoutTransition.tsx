import {
  TransitionGroup,
  Transition as ReactTransition,
} from 'react-transition-group'

import { cloneElement, ReactChild, ReactElement } from 'react'

type TransitionKind<RC> = {
  children: RC
  location: string
}

const TIMEOUT: number = 2000

const LayoutTransition: React.FC<TransitionKind<ReactChild>> = ({
  children,
  location,
}) => {
  return (
    <TransitionGroup className='absolute top-0 h-screen w-full pointer-events-none'>
      <ReactTransition
        key={location}
        mountOnEnter
        unmountOnExit
        timeout={{
          enter: TIMEOUT,
          exit: TIMEOUT,
        }}
      >
        {(status) => (
          <div className='h-full w-full' data-transition-status={status}>
            {cloneElement(children as ReactElement, { status })}
          </div>
        )}
      </ReactTransition>
    </TransitionGroup>
  )
}
export default LayoutTransition
