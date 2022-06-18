import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'

import { doc, getDoc } from 'firebase/firestore'
import { FIRESTORE } from '../server/config/firebase'
import CreateQuestion from '../component/CreateQuestion'
import AdminLayout from '../layout/AdminLayout'

const Dashboard = () => {
  const navigate = useNavigate()
  let uuid = Cookies.get('uuid')

  const [pageLoading, setPageLoading] = useState(true)
  const [userType, setUserType] = useState(undefined)

  const autheticate = async () => {
    const docRef = doc(FIRESTORE, 'users', uuid)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      setPageLoading(false)
      setUserType(docSnap.data().type)
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
          {userType === 'admin' ? (
            <AdminLayout>
              <CreateQuestion />
            </AdminLayout>
          ) : (
            <>USERS</>
          )}
        </>
      ) : (
        <>Loading</>
      )}
    </div>
  )
}

export default Dashboard
