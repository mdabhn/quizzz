import { useNavigate } from 'react-router-dom'
import { SmileOutlined } from '@ant-design/icons'
import { Button, Result } from 'antd'

const YourResult = ({
  totaQuestion,
  correctAns,
  setCheckResultFlag,
  setCurrentQuestionIndex,
}) => {
  const navigate = useNavigate()

  return (
    <div>
      <Result
        icon={<SmileOutlined />}
        title={`You have Correctly Answered ${correctAns} Out of ${totaQuestion} Questions `}
        extra={
          <Button
            type='primary'
            className='text-black'
            onClick={() => {
              setCheckResultFlag(false)
              setCurrentQuestionIndex(0)
              navigate('/dashboard', { replace: false })
            }}
          >
            Try Again
          </Button>
        }
      />
    </div>
  )
}

export default YourResult
