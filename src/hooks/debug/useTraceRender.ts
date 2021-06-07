import { useEffect, useRef } from 'react'

const useTraceRender = <T extends {}>(props: T) => {
  const prev = useRef<T>(props)
  useEffect(() => {
    const changedProps = Object.entries(props).reduce((ps, [k, v]) => {
      // @ts-ignore
      if (prev.current[k] !== v) {
        // @ts-ignore
        ps[k] = [prev.current[k], v]
      }
      return ps
    }, {})
    if (Object.keys(changedProps).length > 0) {
      console.log('Changed props:', changedProps)
    }
    prev.current = props
  })
}

export default useTraceRender
