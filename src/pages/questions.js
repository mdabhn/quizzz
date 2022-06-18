import { useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { contextContainer } from '../App'
import AdminQuestions from '../component/AdminQuestions'
import AdminLayout from '../layout/AdminLayout'

const Questions = () => {
  const navigate = useNavigate()

  const { isAuthenticated, userType } = useContext(contextContainer)

  const checkAuth = () => {
    if (!isAuthenticated || userType !== 'admin') {
      navigate('/login', { replace: true })
    }
  }

  useEffect(() => {
    checkAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <AdminLayout>
      <AdminQuestions />
    </AdminLayout>
  )
}

export default Questions
