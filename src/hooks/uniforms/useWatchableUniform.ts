import { useEffect } from 'react'
import { WatchableRefObject } from '../useWatchableRef'

const useWatchableUniform = (
  uniform: THREE.IUniform,
  ref: WatchableRefObject<any>
) => {
  useEffect(() => ref.onChange((v) => (uniform.value = v)), [ref])
}
export default useWatchableUniform
