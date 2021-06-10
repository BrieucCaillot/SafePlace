import Routes from '@/constants/enums/Routes'
import SFX from '@/constants/SFX'
import useWatchableRef from '@/hooks/useWatchableRef'
import useAudioStore from '@/stores/useAudioStore'
import { useControls } from 'leva'
import { RefObject, useEffect, useRef, useState } from 'react'
import { useFrame } from 'react-three-fiber'
import * as THREE from 'three'

const useWaterfallCursor = ({
  raycastPlane,
  particleRef,
  cursorEase,
  enable,
}: {
  raycastPlane: RefObject<THREE.Mesh>
  particleRef: RefObject<THREE.Mesh>
  cursorEase: number
  enable: boolean
}) => {
  const { volume, fadeDuration, pitchFactor } = useControls(
    'audio.water',
    {
      volume: { min: 0, max: 1, value: 0.03 },
      fadeDuration: 800,
      pitchFactor: 0.03,
    },
    {
      collapsed: true,
      render: (s) =>
        s('path') === Routes.Journey || s('path') === Routes.Waterfall,
    }
  )
  const audio = useAudioStore((s) =>
    s.initAudio(SFX.WATER, { loop: true, volume: 0 })
  )

  const windowMouseRef = useRef<THREE.Vector2>(new THREE.Vector2())
  const targetRayMouseRef = useRef<THREE.Vector3>(
    new THREE.Vector3(-10, -10, -10)
  )
  const [doesIntersect, setDoesIntersect] = useState(false)
  const smoothedRayMouseRef = useWatchableRef<THREE.Vector3>(
    new THREE.Vector3(-10, -10, -10)
  )
  useEffect(() => {
    if (!enable) return
    const handleMouse = (e: MouseEvent) => {
      windowMouseRef.current.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1
      )
    }
    window.addEventListener('mousemove', handleMouse)
    return () => window.removeEventListener('mousemove', handleMouse)
  }, [enable])

  useFrame(({ camera, raycaster }) => {
    if (!enable || raycastPlane.current === null) return
    raycaster.setFromCamera(windowMouseRef.current, camera)
    const intersections = raycaster.intersectObject(raycastPlane.current)

    const newDoesIntersect = intersections.length > 0
    if (newDoesIntersect !== doesIntersect) setDoesIntersect(newDoesIntersect)

    if (newDoesIntersect)
      targetRayMouseRef.current = particleRef.current?.worldToLocal(
        intersections[0].point
      )

    const diff = targetRayMouseRef.current.distanceTo(
      smoothedRayMouseRef.current
    )

    audio.rate(1 + diff * pitchFactor)
    smoothedRayMouseRef.current.lerp(
      targetRayMouseRef.current,
      diff > 15 ? 1 : cursorEase
    )
  })

  useEffect(() => {
    audio.play()
    return () => void audio.stop()
  })
  useEffect(() => {
    audio.volume(volume)
  }, [volume])
  useEffect(() => {
    if (doesIntersect) audio.fade(audio.volume(), volume, fadeDuration)
    else audio.fade(audio.volume(), 0, fadeDuration)
  }, [doesIntersect, fadeDuration, volume])

  return { doesIntersect, smoothedRayMouseRef }
}

export default useWaterfallCursor
