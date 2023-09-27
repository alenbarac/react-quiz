import React from 'react'

const FinishedSreen = ({ points, maxPoints, highScore, dispatch }) => {
  const percentage = (points / maxPoints) * 100
  return (
    <>
      <p className="result">
        You scored <strong>{points}</strong> of {maxPoints} ({Math.ceil(percentage)}%)
      </p>
      <p className="highscore">(Highscore: {highScore} points)</p>

      <button
        onClick={() => {
          dispatch({ type: 'resetQuiz' })
        }}
        className="btn btn-ui"
      >
        Restart Quiz
      </button>
    </>
  )
}

export default FinishedSreen
