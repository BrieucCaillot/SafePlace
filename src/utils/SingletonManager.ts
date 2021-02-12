import Handtrack from './events/Handtrack'
import Raycaster from './events/Raycaster'
import * as THREE from 'three'

export default class SingletonManager {
  private static raycaster: Raycaster | null = null
  private static handtrack: Handtrack | null = null

  public static get Handtrack(): Handtrack {
    if (SingletonManager.handtrack === null) throw new Error('No handtrack created')
    return SingletonManager.handtrack
  }

  public static get Raycaster(): Raycaster {
    if (SingletonManager.raycaster === null) throw new Error('No raycaster created')
    return SingletonManager.raycaster
  }

  public static createHandtrack(video: HTMLVideoElement): Handtrack {
    if (SingletonManager.handtrack !== null) throw new Error('Handtrack already created')
    SingletonManager.handtrack = new Handtrack(video)
    return SingletonManager.handtrack
  }

  public static createRaycaster(camera: THREE.Camera): Raycaster {
    if (SingletonManager.raycaster !== null) throw new Error('Raycaster already created')
    SingletonManager.raycaster = new Raycaster(camera)
    return SingletonManager.raycaster
  }
}
