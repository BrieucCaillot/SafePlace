import ButtonBlob from '@/components/common/UI/Buttons/ButtonBlob'
import SVGSoundOff from '@/components/common/UI/SVG/SVGSoundOff'
import SVGSoundOn from '@/components/common/UI/SVG/SVGSoundOn'

const LayoutSoundButton = () => {
  const isAudioMuted = false

  const onClick = () => {
    // setIsAudioMuted(!isAudioMuted)
  }

  return (
    <ButtonBlob onClick={onClick}>
      {isAudioMuted ? <SVGSoundOff /> : <SVGSoundOn />}
    </ButtonBlob>
  )
}

export default LayoutSoundButton
