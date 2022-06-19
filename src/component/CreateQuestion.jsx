import { useState } from 'react'
import { nanoid } from 'nanoid'
import { doc, setDoc } from 'firebase/firestore'
import { Input, Button, message, Space } from 'antd'
import { FIRESTORE } from '../server/config/firebase'

const CreateQuestion = () => {
  const { TextArea } = Input
  const [loading, setLoading] = useState(false)
  const [question, setQuestion] = useState(undefined)
  const [choices, setCoices] = useState([
    {
      id: nanoid(),
      name: '',
      isTrue: true,
    },
  ])

  const removeFromArray = (id) => {
    if (choices.length > 1) {
      setCoices(choices.filter((item) => item.id !== id))
    }
  }

  const addMoreOption = () => {
    if (choices.length !== 4) {
      setCoices([
        ...choices,
        {
          id: nanoid(),
          name: '',
          isTrue: false,
        },
      ])
    } else {
      message.warning('Max 4 Choices can be added.')
    }
  }

  const MarkAsCorrect = (id) => {
    setCoices(
      choices.map((choice) => {
        if (choice.id === id) {
          choice.isTrue = !choice.isTrue
        } else {
          choice.isTrue = false
        }
        return choice
      })
    )
  }

  const createNewQuestion = async () => {
    setLoading(true)
    let canPass = true

    choices.map((choice) => {
      if (choice.name !== undefined) {
        if (choice.name.trim().length === 0) {
          canPass = false
          return canPass
        }
      }

      return choice
    })

    if (question !== undefined) {
      if (question.trim().length === 0) canPass = false
    } else {
      canPass = true
    }

    if (canPass) {
      message.info('Creating !!!')
      setDoc(doc(FIRESTORE, 'questions', nanoid()), {
        question: question,
        option: [...choices],
        archived: false,
        deleted: false,
      })
        .then(() => {
          message.success('Successfully Created')
          setLoading(false)
          setQuestion(undefined)
          setCoices([
            {
              id: nanoid(),
              name: '',
              isTrue: true,
            },
          ])
        })
        .catch((err) => {
          console.log(err)
          setLoading(false)
        })
    } else {
      message.error('Please Fill up the form!!!')
    }

    setLoading(false)
    return
  }

  return (
    <div className='flex justify-center flex-col items-center'>
      <h1 className='text-xl p-4 font-bold tracking-wide'>
        Create New Question
      </h1>
      <div className='questions__Container '>
        <>
          <label htmlFor='questions'>Question</label>
          <TextArea
            type='text'
            cols={50}
            rows={5}
            style={{ resize: 'none' }}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder='Write Your Question here !!!'
            disabled={loading}
          />
        </>

        <div className='mt-2'>
          {choices.map((c, i) => (
            <div key={c.id}>
              <Space className='mb-2' align='center'>
                <span>Option {i + 1}</span>
                <Input
                  value={c.name}
                  className='rounded-md'
                  onChange={(e) => {
                    setCoices(
                      choices.map((choice) => {
                        if (choice.id === c.id) {
                          choice.name = e.target.value
                        }
                        return choice
                      })
                    )
                  }}
                  disabled={loading}
                  required
                />
                {choices.length > 1 && (
                  <Button
                    onClick={() => removeFromArray(c.id)}
                    className='rounded-xl hover:bg-red-900 hover:text-white'
                    disabled={loading}
                  >
                    Remove
                  </Button>
                )}

                <Button
                  onClick={() => MarkAsCorrect(c.id)}
                  className={`rounded-xl ${c.isTrue && 'bg-green-900'}`}
                  disabled={loading}
                >
                  Mark As Correct
                </Button>
              </Space>
            </div>
          ))}

          <Button
            className='mt-2 rounded-lg'
            onClick={() => {
              addMoreOption()
            }}
            disabled={loading}
          >
            Add More Choices
          </Button>
          <Button
            className='ml-4 rounded-lg'
            loading={loading}
            type='submit'
            onClick={() => createNewQuestion()}
          >
            {' '}
            Create Question
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CreateQuestion
