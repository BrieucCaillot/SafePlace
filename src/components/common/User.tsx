import { useControls } from 'leva'

const User = (): null => {
  useControls({
    clearStorage: {
      type: 'BUTTON',
      value: false,
      onClick: () => {
        window.localStorage.clear()
      },
    },
  })

  return null
}

export default User
