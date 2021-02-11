import SceneLayout from './SceneLayout'

export default function () {
  if (typeof document === 'undefined') return
  const scene = SceneLayout()

  const raf = () => {
    scene.Update()
    requestAnimationFrame(raf)
  }

  raf()
}
