import { useState, createContext } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './pages/dashboard'
import LoginPage from './pages/loginPage'
import Questions from './pages/questions'

export const contextContainer = createContext()

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userType, setUserType] = useState(undefined)

  return (
    <contextContainer.Provider
      value={{
        isAuthenticated: isAuthenticated,
        setIsAuthenticated: setIsAuthenticated,
        userType: userType,
        setUserType: setUserType,
      }}
    >
      <Routes>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/questions' element={<Questions />} />
        <Route path='/' element={<Navigate to={'/login'} />} />
      </Routes>
    </contextContainer.Provider>
  )
}

export default App
