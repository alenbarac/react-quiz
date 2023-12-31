function StartScreen({ numQuestions, dispatch }) {
  return (
    <div className="start">
      <h2>Welcome to the React Quizz</h2>
      <h3>{numQuestions} Questions to test your React mastery</h3>
      <button onClick={() => dispatch({ type: 'start' })} className="btn btn-ui">
        Let's start
      </button>
    </div>
  )
}

export default StartScreen
