import ButtonBlob from '@/components/common/UI/Buttons/ButtonBlob'
import SVGSoundOff from '@/components/common/UI/SVG/SVGSoundOff'
import SVGSoundOn from '@/components/common/UI/SVG/SVGSoundOn'
import useAudioStore from '@/stores/useAudioStore'

const LayoutSoundButton = () => {
  const isMuted = useAudioStore((s) => s.isMuted)
  const setMuted = useAudioStore((s) => s.setMuted)

  return (
    <ButtonBlob onClick={() => setMuted(!isMuted)}>
      {isMuted ? <SVGSoundOff /> : <SVGSoundOn />}
    </ButtonBlob>
  )
}

export default LayoutSoundButton
