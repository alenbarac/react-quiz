import Header from './Header'
import Body from './Body'
import { useEffect, useReducer } from 'react'

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

      default:
        throw new Error('Action unknown')
    }
  }

  const initialState = {
    questions: [],
    // loading,error,ready,active,finished
    status: 'loading',
  }

  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    fetch('http://localhost:8000/questions')
      .then((res) => res.json())
      .then((data) => dispatch({ type: 'dataRecived', payload: data }))
      .catch((error) => dispatch({ type: 'dataFailed,' }))
  }, [])

  return (
    <div className="app">
      <Header />
      <Body>
        <p>1/15</p>
        <p>Question</p>
      </Body>
    </div>
  )
}

export default App
