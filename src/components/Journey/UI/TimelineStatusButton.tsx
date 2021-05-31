import ButtonBlob from '@/components/common/UI/Buttons/ButtonBlob'
import SVGPlay from '@/components/Journey/UI/SVG/SVGPlay'
import SVGPause from '@/components/Journey/UI/SVG/SVGPause'
import useUserStore from '@/stores/useUserStore'

const TimelineStatusButton = () => {
  const isPaused = useUserStore((s) => s.isPaused)
  const setPause = useUserStore((s) => s.setPause)

  return (
    <ButtonBlob onClick={() => setPause(!isPaused)}>
      {isPaused ? <SVGPlay /> : <SVGPause />}
    </ButtonBlob>
  )
}

export default TimelineStatusButton
