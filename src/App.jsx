import Body from './components/Body'
import { useEffect, useReducer } from 'react'
import Loader from './components/Loader'
import StartScreen from './components/StartScreen'
import Question from './components/Question'

function App() {
  function reducer(state, action) {
    switch (action.type) {
      case 'dataRecived':
        return {
          ...state,
          questions: action.payload,
          status: 'ready',
        }
      case 'dataFailed':
        return {
          ...state,
          status: 'error',
        }
      case 'start':
        return {
          ...state,
          status: 'active',
        }
      case 'newAnswer':
        const currentQuestion = state.questions.at(state.index)
        return {
          ...state,
          answer: action.payload,
          points:
            action.payload === currentQuestion.correctOption
              ? state.points + currentQuestion.points
              : state.points,
        }

      default:
        throw new Error('Action unknown')
    }
  }

  const initialState = {
    questions: [],
    // loading,error,ready,active,finished
    status: 'loading',
    index: 0,
    answer: null,
    points: 0,
  }

  const [state, dispatch] = useReducer(reducer, initialState)

  const { questions, status, index, answer } = state

  const numQuestions = questions.length

  useEffect(() => {
    fetch('http://localhost:8000/questions')
      .then((res) => res.json())
      .then((data) => dispatch({ type: 'dataRecived', payload: data }))
      .catch((error) => dispatch({ type: 'dataFailed,' }))
  }, [])

  return (
    <div className="app">
      <Body>
        {status === 'loading' && <Loader />}
        {status === 'error' && <Error />}
        {status === 'ready' && <StartScreen numQuestions={numQuestions} dispatch={dispatch} />}
        {status === 'active' && (
          <Question question={questions[index]} dispatch={dispatch} answer={answer} />
        )}
      </Body>
    </div>
  )
}

export default App
