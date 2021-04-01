import { useControls } from 'leva'

const SafeplaceGround = () => {
  const { color } = useControls('Safeplace Ground', {
    color: '#46765a',
  })

  return (
    <mesh
      name={'Safeplace Ground'}
      position={[0, 0, -200]}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <planeGeometry args={[500, 500, 32, 32]} />
      <meshBasicMaterial color={color} />
    </mesh>
  )
}

export default SafeplaceGround
