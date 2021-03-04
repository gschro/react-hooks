// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js
import React, {useState} from 'react'
import {useLocalStorageState} from '../utils'

const initialSquares = Array(9).fill(null)

function Board({onClick, squares}) {
  function renderSquare(i) {
    return (
      <button className="square" onClick={() => onClick(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  )
}

function Game() {
  const [history, setHistory] = useLocalStorageState('history', [
    initialSquares,
  ])
  const [selectedSquares, setSelectedSquares] = useLocalStorageState(
    'selected',
    0,
  )
  const currentSquares = history[selectedSquares]
  const nextValue = calculateNextValue(currentSquares)
  const winner = calculateWinner(currentSquares)
  const status = calculateStatus(winner, currentSquares, nextValue)
  const [moves, setMoves] = useState([])

  React.useEffect(() => {
    setMoves(
      history.map((squares, index) => {
        const selected = index === selectedSquares
        return (
          <li key={index}>
            <button
              disabled={selected}
              onClick={() => setSelectedSquares(index)}
            >
              {index === 0 ? 'Go to game start' : `Go to move # ${index}`}
              {selected ? ' (current)' : null}
            </button>
          </li>
        )
      }),
    )
  }, [history, selectedSquares, setSelectedSquares])

  function selectSquare(square) {
    if (winner || currentSquares[square]) {
      return
    }

    const nextSquares = [...currentSquares]
    nextSquares[square] = nextValue

    setHistory(history => {
      const previousSquares =
        history.length > selectedSquares + 1
          ? history.slice(0, selectedSquares + 1)
          : history
      return [...previousSquares, nextSquares]
    })
    setSelectedSquares(selected => selected + 1)
  }

  function restart() {
    setSelectedSquares(0)
    setHistory([initialSquares])
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board onClick={selectSquare} squares={currentSquares} />
        <button className="restart" onClick={restart}>
          restart
        </button>
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  )
}

// eslint-disable-next-line no-unused-vars
function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

// eslint-disable-next-line no-unused-vars
function calculateNextValue(squares) {
  const xSquaresCount = squares.filter(r => r === 'X').length
  const oSquaresCount = squares.filter(r => r === 'O').length
  return oSquaresCount === xSquaresCount ? 'X' : 'O'
}

// eslint-disable-next-line no-unused-vars
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function App() {
  return <Game />
}

export default App
