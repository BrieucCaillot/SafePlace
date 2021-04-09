import {
  TransitionGroup,
  Transition as ReactTransition,
} from 'react-transition-group'

import { CSSProperties, ReactChild } from 'react'

type TransitionKind<RC> = {
  children: RC
  location: string
}

const TIMEOUT: number = 200

const transitionStyles: { [name: string]: CSSProperties } = {
  entering: {
    position: `absolute`,
    opacity: 0,
  },
  entered: {
    transition: `opacity ${TIMEOUT}ms ease-in-out`,
    opacity: 1,
    animation: 'blink .3s linear 2',
  },
  exiting: {
    transition: `opacity ${TIMEOUT}ms ease-in-out`,
    opacity: 0,
  },
}

const LayoutTransition: React.FC<TransitionKind<ReactChild>> = ({
  children,
  location,
}) => {
  return (
    <TransitionGroup style={{ position: 'relative', pointerEvents: 'none' }}>
      <ReactTransition
        key={location}
        timeout={{
          enter: TIMEOUT,
          exit: TIMEOUT,
        }}
      >
        {(status) => (
          <div
            data-transition-status={status}
            style={{
              ...transitionStyles[status],
            }}
          >
            {children}
          </div>
        )}
      </ReactTransition>
    </TransitionGroup>
  )
}
export default LayoutTransition
