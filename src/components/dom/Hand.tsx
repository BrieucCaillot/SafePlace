import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import * as handpose from '@tensorflow-models/handpose'
// import '@tensorflow/tfjs-backend-webgl'
import useRAFStore from '@/stores/useRAFStore'
import { useControls } from 'leva'

const Hand = () => {
  const video = useRef<HTMLVideoElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const [isVideoLoaded, setIsVideoLoaded] = useState<boolean>(false)
  const [model, setModel] = useState<handpose.HandPose>()

  const { isPaused } = useControls('Handtrack', { isPaused: false })

  const width = 100
  const height =
    !video.current || !isVideoLoaded
      ? 0
      : video.current.videoHeight / (video.current.videoWidth / width)
  const size = { width, height }

  // const worker = useMemo<Worker | null>(
  //   () =>
  //     typeof Worker === 'undefined'
  //       ? null
  //       : new Worker('/worker/hands.worker.js'),
  //   []
  // )

  // const getMedia = useMemo<typeof navigator.getUserMedia>(() => {
  //   if (typeof navigator === 'undefined') return () => null
  //   const n = navigator as any
  //   return (
  //     n.getUserMedia ||
  //     n.webkitGetUserMedia ||
  //     n.mozGetUserMedia ||
  //     n.msGetUserMedia
  //   )
  // }, [])

  const drawCam = useCallback(() => {
    if (!canvas.current || !video.current) return
    const ctx = canvas.current.getContext('2d')
    if (!ctx) return
    ctx.drawImage(video.current, 0, 0, width, height)
  }, [isVideoLoaded])

  useEffect(() => {
    // if (typeof navigator === 'undefined' || worker === null) return
    // worker.postMessage({ msg: 'load' })

    navigator.getUserMedia(
      { video: true, audio: false },
      (s) => {
        if (!video.current) return
        if ((navigator as any).mozGetUserMedia)
          (video.current as any).mozSrcObject = s
        else video.current.srcObject = s
        video.current.play()
      },
      (e) => console.error(e)
    )
    tf.setBackend('wasm').then(() => {
      handpose.load().then(setModel)
    })
  }, [])

  useEffect(() => {
    if (!isVideoLoaded || !model || isPaused) return

    const handEstimation = console.log
    const estimateHand = async () => {
      if (!video.current) return
      // drawCam()
      const r = await model.estimateHands(video.current)
      handEstimation(r)
    }

    return useRAFStore.getState().subscribe(estimateHand)
  }, [isVideoLoaded, model, isPaused])

  return (
    <>
      <video
        id='video'
        {...size}
        ref={video}
        onLoadedData={() => !isVideoLoaded && setIsVideoLoaded(true)}
      />
      <canvas
        id='canvas'
        ref={canvas}
        {...size}
        style={{ position: 'absolute', zIndex: 1000 }}
      />
    </>
  )
}

export default Hand
