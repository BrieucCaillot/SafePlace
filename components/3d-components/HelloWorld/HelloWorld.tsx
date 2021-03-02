import { Text } from '@react-three/drei'
import { MeshProps } from 'react-three-fiber'

const HelloWorld = (props: MeshProps) => {
  return (
    <Text {...props} fontSize={1} color={'black'}>
      Hello world !
    </Text>
  )
}

export default HelloWorld
