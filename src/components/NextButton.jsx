function NextButton({ dispatch, answer, index, numQuestions }) {
  if (answer === null) return
  if (index < numQuestions - 1)
    return (
      <button
        onClick={() => {
          dispatch({ type: 'nextQuestion' })
        }}
        className="btn btn-ui"
      >
        Next
      </button>
    )

  if (index === numQuestions - 1)
    return (
      <button
        onClick={() => {
          dispatch({ type: 'finishedQuiz' })
        }}
        className="btn btn-ui"
      >
        Finish
      </button>
    )
}

export default NextButton
