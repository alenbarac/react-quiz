import Body from './components/Body'
import { useEffect, useReducer } from 'react'
import Loader from './components/Loader'
import StartScreen from './components/StartScreen'
import Question from './components/Question'
import NextButton from './components/NextButton'
import Progress from './components/Progress'
import FinishedSreen from './components/FinishedSreen'
import Footer from './components/Footer'
import Timer from './components/Timer'

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
          secondsRemaining: state.questions.length * SEC_PER_QUESTION,
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
      case 'resetQuiz':
        return {
          ...state,
          status: 'ready',
          index: 0,
          answer: null,
          points: 0,
          highScore: 0,
        }
      case 'tick':
        return {
          ...state,
          secondsRemaining: state.secondsRemaining - 1,
          status: state.secondsRemaining === 0 ? 'finished' : state.status,
        }

      default:
        throw new Error('Action unknown')
    }
  }

  const SEC_PER_QUESTION = 30

  const initialState = {
    questions: [],
    // loading,error,ready,active,finished
    status: 'loading',
    index: 0,
    answer: null,
    points: 0,
    highScore: 0,
    secondsRemaining: 10,
  }

  const [state, dispatch] = useReducer(reducer, initialState)

  const { questions, status, index, answer, points, highScore, secondsRemaining } = state

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
            <Footer>
              <NextButton
                dispatch={dispatch}
                answer={answer}
                numQuestions={numQuestions}
                index={index}
              />
              <Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />
            </Footer>
          </>
        )}
        {status === 'finished' && (
          <FinishedSreen
            points={points}
            maxPoints={maxPoints}
            highScore={highScore}
            dispatch={dispatch}
          />
        )}
      </Body>
    </div>
  )
}

export default App
