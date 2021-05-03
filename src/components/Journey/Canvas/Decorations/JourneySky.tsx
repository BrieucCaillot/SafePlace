import { Sky } from '@react-three/drei'
import { useControls } from 'leva'

const JourneySky = () => {
  const skyParams = useControls(
    'journey_sky',
    {
      enabled: true,
      distance: 45000,
      turbidity: {
        value: 4.0,
        min: 0,
        max: 20,
      },
      rayleigh: {
        value: 2.1,
        min: 0,
        max: 10,
      },
      mieCoefficient: {
        value: 0.0,
        min: 0,
        max: 0.1,
      },
      mieDirectionalG: {
        value: 0.24,
        min: 0,
        max: 1,
      },
      inclination: {
        value: 0.5,
        min: 0,
        max: 1,
      },
      azimuth: {
        value: 0.46,
        min: 0,
        max: 1,
      },
    },
    { collapsed: true, render: (s) => s('path') === '/journey' }
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

export default JourneySky
