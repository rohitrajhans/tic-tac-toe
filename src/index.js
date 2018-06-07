import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Square extends React.Component {

  render() {
    return (
      <button className={this.props.highlight} onClick={ () => this.props.onClick() } >
        {
          this.props.value
        }
      </button>
    );
  }
}

class Board extends React.Component {

  determineClass(bool) {
    var classname;
    if(bool)
      classname = "high-square";
    else
      classname =  "square";
    return classname;
  }

  renderSquare(i) {
    return (
      <Square
      value={this.props.squares[i]}
      onClick = { () => this.props.onClick(i) }
      highlight = { this.determineClass(this.props.highlight[i]) } 
      />
    );
  }

  render() {

    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Restart extends React.Component {
  render() {
    return(
      <button className="reset-btn" onClick={ () => this.props.onClick() } > Restart </button>
    );
  }
}

class Game extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      history: [ {
        squares : Array(9).fill(null),
      }],
      xIsNext: true,
      highlight: Array(9).fill(0),
    };
  }

  handleClick(i) {
    const history = this.state.history;
    const current = history[history.length - 1];
    const squares = current.squares;
    //console.log( current, current.squares, squares);
    if ( (determineWinner(squares, this.state) === 'X') || (determineWinner(squares, this.state) === 'O') || squares[i] )
      return;
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      xIsNext: !this.state.xIsNext,
      highlight: Array(9).fill(0),
    });
  }

  resetBoard() {
    this.setState( {
      history: [ {
        squares: Array(9).fill(null),
      }],
      xIsNext: true,
    })
  }

  render() {
    const history = this.state.history;
    const current = history[history.length - 1];
    const winner = determineWinner(current.squares, this.state);

    let status;
    if( (winner === 'X') || (winner === 'O') ) {
      status = 'Winner ' + winner;
      setTimeout( ()=> alert( 'Winner is ' + winner), 0);
    }
    else if ( winner === 'd') {
      status = "Game drawn.";
      setTimeout( () => alert('Game drawn.'));
    }
    else
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares = {current.squares}
            onClick = {(i) => this.handleClick(i)}
            highlight = { this.state.highlight }
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div> <Restart onClick = { () => this.resetBoard() } /> </div>
        </div>
      </div>
    );
  }
}


ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function determineWinner(squares, obj) {
  const lines = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,4,8],
    [2,4,6],
    [0,3,6],
    [1,4,7],
    [2,5,8],
  ];
  for( let i =0; i< lines.length; i++) {
    const [a,b,c] = lines[i];
    if( squares[a] && squares[a] === squares[b] && squares[a] === squares[c] ) {
      obj.highlight[a] = obj.highlight[b] = obj.highlight[c] = 1;
      return squares[a];
    }
  }
  let flag = 1;
  for( let i =0; i<squares.length; i++ ) {
    if( squares[i] == null)
      flag = 0;
  }
  if(flag)
    return 'd';
  return null;
}