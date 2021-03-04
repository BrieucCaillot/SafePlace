import * as THREE from 'three'
import { useEffect, useRef } from 'react'
import useHandtrackStore from 'stores/useHandtrackStore'
import style from './Handtrack.module.scss'
import { useFrame } from 'react-three-fiber'
import { lerp } from 'utils/math'

const Handtrack = () => {
  const videoRef = useRef<HTMLVideoElement>(null)

  const areHandsLoaded = useHandtrackStore((s) => s.isLoaded)
  const updateCursorTarget = useHandtrackStore((s) => s.updateCursorTarget)

  useEffect(
    () =>
      useHandtrackStore.getState().subscribe((r) => {
        if (typeof r.multiHandLandmarks === 'undefined') return
        const { x, y } = r.multiHandLandmarks[0][9]
        updateCursorTarget(x, y)
      }),
    []
  )

  useEffect(() => {
    if (videoRef.current === null)
      throw new Error('Video element is not loaded')
    const { initHands, initCamera, load } = useHandtrackStore.getState()
    initHands()
    initCamera(videoRef.current)
    load()
  }, [])

  useEffect(() => {
    if (areHandsLoaded) useHandtrackStore.getState().start()
  }, [areHandsLoaded])

  return <video className={style['video']} ref={videoRef} />
}

export default Handtrack
