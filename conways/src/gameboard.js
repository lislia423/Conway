import React, { Component } from 'react';


class Cell extends React.Component {
  render() {
    return (
      <button className="cell">{this.props.value}</button>
    );
  }
}

class Gameboard extends React.Component {
  renderCell(i) {
    return <Cell value={i} />
  }

  createBoard = () => {
    let width = document.getElementById("user_board_width").value;
    console.log(width);
    let height = document.getElementById("user_board_height").value;
    console.log(height);
    let gameboard_mf = []

    // Outer loop to create parent
    for (let i = 0; i < width; i++) {
      let row_cells = []
      //Inner loop to create children
      for (let j = 0; j < height; j++) {
        row_cells.push(this.renderCell(" "))
      }
      //Create the parent and add the children
      gameboard_mf.push(<div className="board-row">{row_cells}</div>)
    }
    return gameboard_mf
  }

  render() {
    return (
      <div>
        {this.createBoard()}

      </div>
    );
  }
}

class Game extends React.Component {
  render() {
    return (
      <div className='game'>
        <div className = 'game-board'>
          <Gameboard/>
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
