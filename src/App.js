import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/dashboard'
import LoginPage from './pages/loginPage'

const App = () => {
  return (
    <>
      <Routes>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/dashboard' element={<Dashboard />} />
      </Routes>
    </>
  )
}

export default App
