import { useState, useEffect } from 'react'

import { collection, query, where, getDocs } from 'firebase/firestore'

import { FIRESTORE } from '../server/config/firebase'
import { Button, Radio, Space, Spin } from 'antd'

const Answers = () => {
  const [questions, setQuestions] = useState([])
  const [pageLoading, setPageLoading] = useState(true)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

  const fetchData = async () => {
    const Q = query(
      collection(FIRESTORE, 'questions'),
      where('archived', '==', false),
      where('deleted', '==', false)
    )

    const querySnapshot = await getDocs(Q)

    let data = []

    if (!querySnapshot.empty) {
      querySnapshot.forEach((doc) => {
        data.push({
          id: doc.id,
          ...doc.data(),
        })
      })
      setQuestions(data)
    }

    setPageLoading(false)
  }

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      {pageLoading ? (
        <div className='flex justify-center items-center flex-col h-screen'>
          <Spin size='large' />
          <p>Loading...</p>
        </div>
      ) : questions.length === 0 ? (
        <div className='flex justify-center items-center flex-col h-screen'>
          <p>No Question Available</p>
        </div>
      ) : (
        <div className='flex items-center flex-col h-screen mt-24'>
          <p className='font-bold text-2xl'>
            Total Questions {questions.length}
          </p>
          <div
            className='flex border-2 border-gray-900 p-10 flex-col'
            style={{ width: '50%' }}
          >
            <div>
              <p className='font-bold text-xl'>
                # Question {currentQuestionIndex + 1} -{' '}
                <span className='font-noraml'>
                  {questions[currentQuestionIndex].question}
                </span>
              </p>

              <p className='font-medium mt-2'>Options</p>
              <Radio.Group
                defaultValue={questions[currentQuestionIndex].option[0].id}
              >
                <Space direction='vertical'>
                  {questions[currentQuestionIndex].option.map((data) => (
                    <Radio key={data.id} value={data.id}>
                      {data.name}
                    </Radio>
                  ))}
                </Space>
              </Radio.Group>
              <div className='flex justify-end'>
                {currentQuestionIndex === questions.length - 1 ? (
                  <>
                    <Button
                      className='mt-2 w-32'
                      onClick={() => {
                        setCurrentQuestionIndex((ix) => ix - 1)
                      }}
                    >
                      Back
                    </Button>
                    <Button className='mt-2 w-32 ml-2'>Check Result</Button>
                  </>
                ) : (
                  <Button
                    className='mt-2 w-32'
                    onClick={() => {
                      setCurrentQuestionIndex((ix) => ix + 1)
                    }}
                  >
                    Next
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Answers
