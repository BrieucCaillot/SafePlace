import useAudioStore from '@/stores/useAudioStore'
import ButtonBlob from '@/components/common/UI/Buttons/ButtonBlob'
import SVGSoundOff from '@/components/common/UI/SVG/SVGSoundOff'
import SVGSoundOn from '@/components/common/UI/SVG/SVGSoundOn'

const LayoutSoundButton = () => {
  const isAudioMuted = useAudioStore((state) => state.isAudioMuted)
  const setIsAudioMuted = useAudioStore((state) => state.setIsAudioMutued)

  const onClick = () => {
    setIsAudioMuted(!isAudioMuted)
  }

  return (
    <ButtonBlob onClick={onClick}>
      {isAudioMuted ? <SVGSoundOff /> : <SVGSoundOn />}
    </ButtonBlob>
  )
}

export default LayoutSoundButton
