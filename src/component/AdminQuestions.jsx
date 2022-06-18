import { useState, useEffect } from 'react'
import {
  Spin,
  Collapse,
  Empty,
  Button,
  message,
  Modal,
  Input,
  Space,
} from 'antd'
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from 'firebase/firestore'

import { FIRESTORE } from '../server/config/firebase'

import Tick from '../assets/check.png'
import { nanoid } from 'nanoid'

const AdminQuestions = () => {
  const { Panel } = Collapse
  const { TextArea } = Input

  const [loading, setLoading] = useState(false)
  const [isUpdated, setIsUpdated] = useState(false)
  const [question, setQuestion] = useState(undefined)
  const [fetching, setFetching] = useState(false)
  const [questions, setQuestions] = useState([])

  const [modalVisible, setModalVisible] = useState(false)

  const fetchData = async () => {
    const Q = query(
      collection(FIRESTORE, 'questions'),
      where('archived', '==', false)
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

    setFetching(false)
  }

  const onChange = (key) => {}

  const removeQuestion = async ({ id }) => {
    setQuestions(questions.filter((data) => data.id !== id))
    const docRef = doc(FIRESTORE, 'questions', id)

    await updateDoc(docRef, {
      archived: true,
    })

    message.success('Deleted')
  }

  const Options = ({ id }) => {
    return (
      <>
        <Button
          onClick={() => {
            setModalVisible(true)
            setQuestion(...questions.filter((qs) => qs.id === id))
          }}
        >
          Edit
        </Button>
        <Button
          className='text-red-900 ml-1'
          onClick={() => removeQuestion(id)}
        >
          Delete
        </Button>
      </>
    )
  }

  const addMoreOption = () => {
    if (question.option.length < 4) {
      setQuestion({
        ...question,
        option: [
          ...question.option,
          {
            id: nanoid(),
            name: '',
            isTrue: false,
          },
        ],
      })
    } else {
      message.warning('Max 4 Choice can be added')
      setQuestion({
        ...question,
        option: (question.option[1].isTrue = true),
      })
    }
  }

  const removeOption = (id) => {
    if (question.option.length > 1) {
      setQuestion({
        ...question,
        option: question.option.filter((qt) => qt.id !== id),
      })
    } else {
      message.warning('Options can not be empty')
    }
  }

  const updateQuestion = async () => {
    // setModalVisible(false)
    setLoading(true)
    let pass = true

    if (question.question.trim().length === 0) {
      message.error("Title can't be empty")
      pass = false
    }

    let count = 0

    question.option.map((opt) => {
      if (opt.name.trim().length === 0) {
        message.error("Title can't be empty")
        pass = false
      }
      if (opt.isTrue === true) count += 1
      return pass
    })

    if (count === 0) {
      pass = false
      message.error('Please Mark an answer True')
    }

    if (pass) {
      console.log('updating')
      const docRef = doc(FIRESTORE, 'questions', question.id)

      updateDoc(docRef, {
        ...question,
      }).then(() => {
        message.success('data has been updated')
        setQuestion(undefined)
        setIsUpdated(!isUpdated)
      })

      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUpdated])

  return (
    <div>
      {question && (
        <Modal
          title={`Ques: ${question.question}`}
          visible={modalVisible}
          okButtonProps={{
            loading: loading,
            style: {
              color: 'black',
            },
          }}
          okText='Update'
          onOk={() => updateQuestion()}
          onCancel={() => setModalVisible(false)}
        >
          <p>
            <label htmlFor='question'>Question</label>
            <TextArea
              type='text'
              cols={50}
              rows={5}
              style={{ resize: 'none' }}
              value={question.question}
              onChange={(e) => {
                setQuestion({
                  ...question,
                  question: e.target.value,
                })
              }}
              placeholder='Write Your Question here !!!'
            />
          </p>
          <p className='mt-2'>Options:</p>
          {question.option.map((opt) => (
            <Space key={opt.key} className='flex align-center mb-2'>
              <Input
                value={opt.name}
                onChange={(e) => {
                  setQuestion({
                    ...question,
                    option: question.option.map((d) => {
                      if (d.id === opt.id) {
                        d.name = e.target.value
                      }
                      return d
                    }),
                  })
                }}
              />
              <Button
                className={`rounded-xl ${opt.isTrue && 'bg-green-900'}`}
                onClick={(e) => {
                  setQuestion({
                    ...question,
                    option: question.option.map((d) => {
                      if (d.id === opt.id) {
                        d.isTrue = true
                        message.success('updated')
                      } else {
                        d.isTrue = false
                      }
                      return d
                    }),
                  })
                }}
              >
                Mark As Correct
              </Button>
              <Button className='rounded' onClick={() => removeOption(opt.id)}>
                Remove
              </Button>
            </Space>
          ))}
          <p>
            <Button className='w-32' onClick={() => addMoreOption()}>
              Add Option
            </Button>
          </p>
        </Modal>
      )}

      <h1 className='font-bold text-center mt-10 text-xl'>
        All Available Questions
      </h1>

      {fetching ? (
        <div className='flex justify-center items-center flex-col h-screen'>
          <Spin size='large' />
          <p>Loading...</p>
        </div>
      ) : questions.length > 0 ? (
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
      ) : (
        <Empty className='mt-10' />
      )}
    </div>
  )
}

export default AdminQuestions
