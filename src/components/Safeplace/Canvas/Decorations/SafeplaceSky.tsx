import { Sky } from '@react-three/drei'
import { useControls } from 'leva'

const SafeplaceSky = () => {
  const skyParams = useControls(
    'safeplace_sky',
    {
      enabled: true,
      distance: 45000,
      turbidity: {
        value: 1.0,
        min: 0,
        max: 20,
      },
      rayleigh: {
        value: 3.0,
        min: 0,
        max: 10,
      },
      mieCoefficient: {
        value: 0.0,
        min: 0,
        max: 0.1,
      },
      mieDirectionalG: {
        value: 0.15,
        min: 0,
        max: 1,
      },
      inclination: {
        value: 0.54,
        min: 0,
        max: 1,
      },
      azimuth: {
        value: 0.39,
        min: 0,
        max: 1,
      },
    },
    { collapsed: true, render: (s) => s('path') === '/safeplace' }
  )

  return (
    <>
      {skyParams.enabled && (
        <Sky
          {...skyParams}
          // {...props} // All three/examples/jsm/objects/Sky props are valid
        />
      )}
    </>
  )
}

export default SafeplaceSky
