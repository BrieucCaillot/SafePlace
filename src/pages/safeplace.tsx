import PortalUI from '@/components/common/UI/PortalUI'
import ResourcesButton from '@/components/Safeplace/UI/ResourcesButton'
import InsideButton from '@/components/Safeplace/UI/InsideButton'
import SafeplaceVoiceover from '@/components/Safeplace/UI/SafeplaceVoiceover'

const Safeplace = () => {
  return (
    <>
      <PortalUI selector='#layout-bottom-left'>
        <ResourcesButton />
        <InsideButton />
      </PortalUI>
      {/* <PortalUI selector='#layout-bottom-right'></PortalUI> */}
      <SafeplaceVoiceover />
    </>
  )
}

export default Safeplace
