import React, { Component } from 'react';


class Cell extends React.Component {
  // Constructs a cell with a status initiall equal to dead
  constructor(props) {
    super(props);
    console.log(this.props.status);
  }
  // renders the new cell as a button
  render() {
    return (
      <button className="cell" style={{backgroundColor: this.props.color}}>{this.props.value}</button>
    );
  }
}

class Gameboard extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.board = this.createBoard();
  }
  // creates a new cell object with value of i
  renderCell(i) {
  let status = "dead";
  let num = Math.floor(Math.random() * Math.floor(4));
  let color = "#FF0000";
  if (num > 2) {
    status = "alive";
  }
  if (status == "dead") {
    color = "#FFFFFF";
  }
   
    return <Cell key = {i} status = {status} color={color}/>
  }

  createBoard = () => {
    let width = 20;
    let height = 20;
    let gameboard_mf = []
    let cell_key = 0;
    let array_key = 0;
    // Outer loop to create parent
    for (let i = 0; i < width; i++) {
      let row_cells = []
      //Inner loop to create children
      for (let j = 0; j < height; j++) {
        
        row_cells.push(this.renderCell(cell_key))
        cell_key += 1;
      }
      //Create the parent and add the children
      gameboard_mf.push(<div key = {array_key} className="board-row">{row_cells}</div>)
      array_key += 1;
    }
    return gameboard_mf
  }

  render() {
    return (
      <div>
        {this.board}
      </div>
    );
  }
}

class Game extends React.Component {
  checkNeighbors = () => {

    // loop through all the cells on the board
    for (let row = 0; row < 20; ++row) {
      for (let col = 0; col < 20; ++col) {

      }
    }
  }
  renderGameBoard = () => {
    return <Gameboard />
  }

  render() {
    return (
      <div className='game'>
        <div className = 'game-board'>
          {this.renderGameBoard()}
        </div>
      </div>
    )
  }
}

// ReactDOM.render(
//   <Game />,
//   document.getElementById('root')
// );

export default Gameboard;
