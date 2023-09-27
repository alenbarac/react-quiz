import Body from './components/Body'
import { useEffect, useReducer } from 'react'
import Loader from './components/Loader'
import StartScreen from './components/StartScreen'
import Question from './components/Question'
import NextButton from './components/NextButton'
import Progress from './components/Progress'
import FinishedSreen from './components/FinishedSreen'

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

      case 'nextQuestion':
        return {
          ...state,
          index: state.index + 1,
          answer: null,
        }

      case 'finishedQuiz':
        return {
          ...state,
          status: 'finished',
          highScore: state.points > state.highScore ? state.points : state.highScore,
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
    highScore: 0,
  }

  const [state, dispatch] = useReducer(reducer, initialState)

  const { questions, status, index, answer, points, highScore } = state

  const numQuestions = questions.length
  const maxPoints = questions.reduce((prev, curr) => prev + curr.points, 0)

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
          <>
            <Progress
              index={index}
              numQuestions={numQuestions}
              points={points}
              maxPoints={maxPoints}
              answer={answer}
            />
            <Question question={questions[index]} dispatch={dispatch} answer={answer} />
            <NextButton
              dispatch={dispatch}
              answer={answer}
              numQuestions={numQuestions}
              index={index}
            />
          </>
        )}
        {status === 'finished' && (
          <FinishedSreen points={points} maxPoints={maxPoints} highScore={highScore} />
        )}
      </Body>
    </div>
  )
}

export default App
