import style from './HandNote.module.scss'

const HandNote = () => {
  return (
    <img
      src="textures/tuto_onboarding.gif"
      alt="Tutoriel mouvement de main"
      className={style['HandNote']}
    />
  )
}

export default HandNote
