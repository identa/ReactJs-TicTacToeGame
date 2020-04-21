import React from 'react';
import Board from './Board';


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
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function bestSquare(squares){
    return minimax(squares, 'O').index;
  }

function minimax(squares, player){
    const availSquares = getEmptySquares(squares);

    if (calculateWinner(squares) === 'X') {
      return {score:-10};
    } else if (calculateWinner(squares) === 'O') {
      return {score: 10};
    } else if (availSquares.length === 0) {
      return {score: 0};
    }

    let moves = [];
    for(let i = 0; i < availSquares.length;i++){
      let move = {};
      move.index = squares[availSquares[i]];
      squares[availSquares[i]] = player;

      if (player === 'O') {
      let result = minimax(squares, 'X');
      move.score = result.score;

      } else {
      let result = minimax(squares, 'O');
      move.score = result.score;

      }

      squares[availSquares[i]] = move.index;

      moves.push(move);
    }

      let bestMove;
  if(player === 'O') {
    let bestScore = -10000;
    for(let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    let bestScore = 10000;
    for(let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  return moves[bestMove];
  }

function getEmptySquares(squares){
    const emptySqrs = squares.filter(s => typeof s == 'number');
    return emptySqrs;
  }
  
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array.from(Array(9).keys())
      }],
      xIsNext: true
    };
  }


  handleClick(i) {
    const history = this.state.history;
    // get object containing squares
    const current = history[history.length - 1];
    // get squares's copy
    const squares = current.squares.slice();
    

    if (calculateWinner(squares) || typeof squares[i] != 'number') {
      return;
    }
    squares[i] = 'X';
    squares[bestSquare(squares)] = 'O';
    this.setState({
      history: history.concat([{
        squares: squares
      }]),
      xIsNext: !this.state.xIsNext,
    });
  }
  
  

  render() {
    const history = this.state.history;
    const current = history[history.length - 1];
    const winner = calculateWinner(current.squares);

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

export default Game;