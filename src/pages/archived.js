import { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { contextContainer } from '../App'
import ArchivedQuestions from '../component/ArchivedQuestions'
import AdminLayout from '../layout/AdminLayout'

const Archived = () => {
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
      <ArchivedQuestions />
    </AdminLayout>
  )
}

export default Archived
