import SingletonManager from '@/utils/SingletonManager'
import Stats from 'stats.js'
import SceneLayout from './SceneLayout'

export default function () {
  if (typeof document === 'undefined') return
  SingletonManager.createHandtrack(document.querySelector('video') as HTMLVideoElement)
  const scene = SceneLayout()

  const stats = new Stats()
  stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
  document.body.appendChild(stats.dom)

  const raf = () => {
    stats.begin()
    scene.Update()
    stats.end()
    requestAnimationFrame(raf)
  }

  raf()
}
