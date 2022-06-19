import { useEffect, useState } from 'react'
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from 'firebase/firestore'

import { FIRESTORE } from '../server/config/firebase'

import { Button, Collapse, Empty, message, Spin } from 'antd'
import Tick from '../assets/check.png'

const { Panel } = Collapse

const ArchivedQuestions = () => {
  const [pageLoading, setPageLoading] = useState(true)
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(false)

  const onChange = (key) => {}

  const bringBack = async (id) => {
    setLoading(true)
    const docRef = doc(FIRESTORE, 'questions', id)

    await updateDoc(docRef, {
      archived: false,
    })

    setQuestions(questions.filter((data) => data.id !== id))
    setLoading(false)

    message.success('Restored')
  }

  const deletePermanently = async (id) => {
    setLoading(true)
    const docRef = doc(FIRESTORE, 'questions', id)

    await updateDoc(docRef, {
      deleted: true,
    })

    setQuestions(questions.filter((data) => data.id !== id))
    setLoading(false)

    message.success('Deleted Permanently')
  }

  const Options = ({ id }) => {
    return (
      <>
        <Button
          className='text-yellow-900 ml-1 hover:bg-green-800 hover:text-white'
          onClick={() => bringBack(id)}
          loading={loading}
        >
          Restore
        </Button>

        <Button
          className='text-red-900 ml-1 hover:bg-red-800 hover:text-white'
          onClick={() => deletePermanently(id)}
          loading={loading}
        >
          Delete Permanently
        </Button>
      </>
    )
  }

  const fetchData = async () => {
    const Q = query(
      collection(FIRESTORE, 'questions'),
      where('archived', '==', true),
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
      <h1 className='font-bold text-center mt-10 text-xl'>
        Archived Questions
      </h1>
      {pageLoading ? (
        <div className='flex justify-center items-center flex-col h-screen'>
          <Spin size='large' className='mb-4' />
          <span>Loading...</span>
        </div>
      ) : questions.length === 0 ? (
        <div className='flex justify-center items-center flex-col mt-12'>
          <Empty />
        </div>
      ) : (
        <div className='flex items-center mt-2 flex-col h-screen'>
          <Collapse onChange={onChange} style={{ width: '65%' }}>
            {questions.map((q) => (
              <Panel
                header={q.question}
                key={q.id}
                extra={<Options id={q.id} />}
              >
                <p>Options</p>
                {q.option.map((opt, i) => (
                  <div key={opt.id}>
                    <p>
                      <span>
                        {i + 1}. {opt.name}{' '}
                      </span>
                      <span>
                        {opt.isTrue && (
                          <img
                            className='inline ml-2'
                            src={Tick}
                            alt='correct ans'
                          />
                        )}
                      </span>
                    </p>
                  </div>
                ))}
                {/* <Options id={q.id} /> */}
              </Panel>
            ))}
          </Collapse>
        </div>
      )}
    </div>
  )
}

export default ArchivedQuestions
