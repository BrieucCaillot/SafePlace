import { useControls } from 'leva'

const SafeplaceGround = () => {
  const { color, frequency } = useControls('Safeplace Ground', {
    color: '#6eb46b',
    frequency: {
      x: 0,
      y: 0,
    },
  })

  return (
    <mesh
      name={'Safeplace Ground'}
      position={[0, 0, -200]}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <planeGeometry args={[500, 500, 32, 32]} />
      <meshBasicMaterial />
    </mesh>
  )
}

export default SafeplaceGround
