import { useEffect } from 'react'

import useSafeplaceStore, { SafeplacePOI } from '@/stores/useSafeplaceStore'
import AboutDom from '@/components/About/AboutDom'

const About = () => {
  const setCurrentPOI = useSafeplaceStore((state) => state.setCurrentPOI)

  useEffect(() => {
    setCurrentPOI(SafeplacePOI.About)
  }, [])

  return (
    <>
      <AboutDom />
    </>
  )
}

export default About
