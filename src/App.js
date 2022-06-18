import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/dashboard'
import LoginPage from './pages/loginPage'
import Questions from './pages/questions'

const App = () => {
  return (
    <>
      <Routes>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/questions' element={<Questions />} />
      </Routes>
    </>
  )
}

export default App
