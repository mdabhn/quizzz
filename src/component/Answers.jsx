import { useState, useEffect } from 'react'

import { collection, query, where, getDocs } from 'firebase/firestore'

import { FIRESTORE } from '../server/config/firebase'
import { Button, Spin } from 'antd'

const Answers = () => {
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState([])
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
    let answersArr = []

    if (!querySnapshot.empty) {
      querySnapshot.forEach((doc) => {
        data.push({
          id: doc.id,
          ...doc.data(),
        })
        answersArr.push({
          id: doc.id,
          ansId: null,
        })
      })
      setQuestions(data)
      setAnswers(answersArr)
    }

    setPageLoading(false)
  }

  useEffect(() => {
    if (localStorage.getItem('answers') !== null) {
      setAnswers(JSON.parse(localStorage.getItem('answers')))
    }
  }, [questions])

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

              {questions[currentQuestionIndex].option.map((opt) => (
                <div
                  className={`border-2 p-2 m-2 border-teal-800 hover:cursor-pointer ${
                    opt.id === answers[currentQuestionIndex].ansId &&
                    'bg-green-700 text-white'
                  }`}
                  key={opt.id}
                  onClick={() => {
                    setAnswers(
                      answers.map((ans) => {
                        if (ans.id === answers[currentQuestionIndex].id) {
                          ans.ansId = opt.id
                        }
                        return ans
                      })
                    )

                    localStorage.setItem('answers', JSON.stringify(answers))
                  }}
                >
                  {opt.name}
                </div>
              ))}

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
