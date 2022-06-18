import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, query, where, getDocs } from 'firebase/firestore'
import Cookies from 'js-cookie'

import { Button, Form, Input, message } from 'antd'
import { FIRESTORE } from '../server/config/firebase'

const Login = () => {
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [mail, setMail] = useState('')
  const [password, setPassword] = useState('')

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
    </div>
  )
}

export default Login
