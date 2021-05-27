import * as THREE from 'three'

const promisifyAction = (
  mixer: THREE.AnimationMixer,
  action: THREE.AnimationAction
) =>
  new Promise<THREE.Event>((res) => {
    mixer.addEventListener('finished', (event) => {
      if (event.action === action) res(event)
    })
  })

export default promisifyAction
