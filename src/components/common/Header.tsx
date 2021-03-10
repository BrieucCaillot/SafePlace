import Link from 'next/link'

const Header = () => (
  <header className='flex align-center justify-between p-10'>
    <Link href='/'>
      <a className='bg-skyblue border-gray-50 text-white'>Home</a>
    </Link>
    <Link href='/test'>
      <a className='bg-skyblue border-gray-50 text-white'>Test</a>
    </Link>
    <Link href='/about'>
      <a className='bg-skyblue border-gray-50 text-white'>A propos</a>
    </Link>
  </header>
)

export default Header