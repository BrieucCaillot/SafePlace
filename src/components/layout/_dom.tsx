import Head from 'next/head'

const Header = () => {
  return (
    <Head>
      <title>No title</title>
    </Head>
  )
}
const Dom = ({ dom }) => {
  return (
    <div className='absolute top-0 left-0 right-0 z-20 dom'>
      <Header />
      {dom}
    </div>
  )
}

export default Dom
