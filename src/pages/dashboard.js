import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'

import { contextContainer } from '../App'

import Cookies from 'js-cookie'

import { doc, getDoc } from 'firebase/firestore'
import { FIRESTORE } from '../server/config/firebase'
import CreateQuestion from '../component/CreateQuestion'
import AdminLayout from '../layout/AdminLayout'
import { Spin } from 'antd'
import UserLayout from '../layout/UserLayout'

const Dashboard = () => {
  const context = useContext(contextContainer)

  const navigate = useNavigate()
  let uuid = Cookies.get('uuid')

  const [pageLoading, setPageLoading] = useState(true)

  const autheticate = async () => {
    const docRef = doc(FIRESTORE, 'users', uuid)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      setPageLoading(false)
      context.setIsAuthenticated(true)
      context.setUserType(docSnap.data().type)
    } else {
      navigate('/login', { replace: true })
    }
  }

  useEffect(() => {
    if (uuid === undefined) {
      navigate('/login', { replace: true })
    } else {
      autheticate()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      {!pageLoading ? (
        <>
          {context.userType === 'admin' ? (
            <AdminLayout>
              <CreateQuestion />
            </AdminLayout>
          ) : (
            <UserLayout>USERS</UserLayout>
          )}
        </>
      ) : (
        <div className='flex justify-center items-center flex-col h-screen'>
          <Spin size='large' />
          <p>Loading...</p>
        </div>
      )}
    </div>
  )
}

export default Dashboard
