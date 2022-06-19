import { Link, useLocation } from 'react-router-dom'

const AdminLayout = ({ children }) => {
  const location = useLocation()
  let pathname = location.pathname

  return (
    <div>
      <header className='bg-gray-600 p-4'>
        <nav>
          <ul className='flex justify-end'>
            <Link
              to={'/dashboard'}
              className={`ml-2 p-2 hover:cursor-pointer ${
                pathname === '/dashboard' && 'underline text-white'
              }`}
            >
              Home
            </Link>
            <Link
              to={'/questions'}
              className={`ml-2 p-2 hover:cursor-pointer ${
                pathname === '/questions' && 'underline text-white'
              }`}
            >
              All Questions
            </Link>
            <Link
              to={'/archived'}
              className={`ml-2 p-2 hover:cursor-pointer ${
                pathname === '/archived' && 'underline text-white'
              }`}
            >
              Archived
            </Link>
            <Link
              to={'/answers'}
              className={`ml-2 p-2 hover:cursor-pointer ${
                pathname === '/' && 'underline text-white'
              }`}
            >
              Answers
            </Link>
            <Link
              to={'/'}
              className='ml-2 text-red-700 border-2 border-red-800 p-2 hover:cursor-pointer'
            >
              LOGOUT
            </Link>
          </ul>
        </nav>
      </header>
      {children}
    </div>
  )
}

export default AdminLayout
