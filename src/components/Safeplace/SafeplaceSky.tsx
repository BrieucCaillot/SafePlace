import { Sky } from '@react-three/drei'
import { useControls } from 'leva'

const SafeplaceSky = () => {
  const skyParams = useControls(
    'Safeplace Sky',
    {
      distance: 45000,
      turbidity: {
        value: 1.0,
        min: 0,
        max: 20,
      },
      rayleigh: {
        value: 0.5,
        min: 0,
        max: 10,
      },
      mieCoefficient: {
        value: 0.0,
        min: 0,
        max: 0.1,
      },
      mieDirectionalG: {
        value: 0.39,
        min: 0,
        max: 1,
      },
      inclination: {
        value: 0.55,
        min: 0,
        max: 1,
      },
      azimuth: {
        value: 0.39,
        min: 0,
        max: 1,
      },
    },
    { collapsed: true }
  )

  return (
    <Sky
      {...skyParams}
      // {...props} // All three/examples/jsm/objects/Sky props are valid
    />
  )
}

export default SafeplaceSky
