import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from 'firebase/firestore'
import Cookies from 'js-cookie'

import { Button, Form, Input, message, Spin } from 'antd'
import { FIRESTORE } from '../server/config/firebase'
import { contextContainer } from '../App'

const Login = () => {
  const navigate = useNavigate()
  const context = useContext(contextContainer)

  const [pageLoading, setPageLoading] = useState(true)

  const [loading, setLoading] = useState(false)
  const [mail, setMail] = useState('')
  const [password, setPassword] = useState('')

  let uuid = Cookies.get('uuid')
  const autheticate = async () => {
    const docRef = doc(FIRESTORE, 'users', uuid)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      setPageLoading(false)
      context.setIsAuthenticated(true)
      context.setUserType(docSnap.data().type)
      navigate('/dashboard', { replace: true })
    } else {
      navigate('/login', { replace: true })
    }
  }

  useEffect(() => {
    if (uuid === undefined) {
      console.log('--')
      navigate('/login', { replace: true })
      setPageLoading(false)
    } else {
      autheticate()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onFinish = async (values) => {
    setLoading(true)
    const q = query(
      collection(FIRESTORE, 'users'),
      where('email', '==', mail),
      where('password', '==', password)
    )
    const querySnapshot = await getDocs(q)

    console.log('querySnapshot.empty', querySnapshot.empty)

    if (querySnapshot.empty) {
      message.error('User Does not Exist', [3])
      setLoading(false)
    } else {
      message.success('Success', [3])
      let id = ''

      querySnapshot.forEach((doc) => {
        id = doc.id
      })

      Cookies.set('uuid', id)

      setTimeout(() => {
        navigate('/dashboard', { replace: true })
      }, 3000)
    }
  }

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }

  return (
    <div>
      {pageLoading ? (
        <div className='flex h-screen justify-end items-center'>
          <Spin size='large' />
        </div>
      ) : (
        <>
          <h1 className='text-center text-xl'>Login</h1>
          <div className='border-2 border-gray-700 p-20'>
            <Form
              name='basic'
              labelCol={{
                span: 8,
              }}
              wrapperCol={{
                span: 16,
              }}
              initialValues={{
                remember: true,
              }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete='off'
            >
              <Form.Item
                label='Email'
                name='email'
                rules={[
                  {
                    required: true,
                    message: 'Please input your email!',
                  },
                ]}
              >
                <Input value={mail} onChange={(e) => setMail(e.target.value)} />
              </Form.Item>

              <Form.Item
                label='Password'
                name='password'
                rules={[
                  {
                    required: true,
                    message: 'Please input your password!',
                  },
                ]}
              >
                <Input.Password
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Item>

              <Form.Item
                wrapperCol={{
                  offset: 10,
                }}
              >
                <Button
                  type='primary'
                  htmlType='submit'
                  className='text-black w-24'
                  loading={loading}
                >
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </div>
        </>
      )}
    </div>
  )
}

export default Login
