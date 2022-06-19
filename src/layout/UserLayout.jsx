import { Link } from 'react-router-dom'
import Cookies from 'js-cookie'

const UserLayout = ({ children }) => {
  return (
    <div>
      <header className='bg-gray-600 p-4'>
        <nav>
          <ul className='flex justify-end'>
            <Link
              to={'/'}
              onClick={() => {
                Cookies.remove('uuid')
              }}
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

export default UserLayout
