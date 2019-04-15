import React, { Component } from 'react';
import './gameboard.css';

//EXAMPLE FOR USING STATE AND SETSTATE

// class Cell extends React.Component {
//   // Constructs a cell with a status initiall equal to dead
//   constructor(props) {
//     super(props);
    
//     this.changeColorOnClick.bind(this);
//     this.state = {
//       living: "dead",
//       bgColor: "#FFFFFF",
//       cell_name: "deadCell"
//     }
//   }
//   // method for changing cell color and status on click
//   changeColorOnClick = () =>{
//     if(this.state.living === "dead"){
//       this.setState({living: "alive", cell_name: "liveCell"});
//       console.log("living: "+this.state.living + " cell name: "+this.state.cell_name);
  
//     }
//     else{
//       this.setState({living: "dead", cell_name: "deadCell"});
//       console.log("living: "+this.state.living + " cell name: "+this.state.cell_name);

//     }
    
//   }
class Cell extends React.Component {
  // Constructs a cell with a status initiall equal to dead
  constructor(props) {
    super(props);
    this.state = {
      living: this.props.status
    }
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
  if (status === "dead") {
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

  checkNeighbors = () => {
    let width = 20;
    let height = 20;
    // loop through all the cells on the board
    for (let row = 0; row < height; ++row) {
      for (let col = 0; col < height; ++col) {
        let cell_status = this.board[row].props.children[col].props.status;

        let left_bound = col-1;
        if (col === 0) {
          left_bound = col;
        }
        else {
          left_bound = col-1;
        }

        let right_bound = col+1;
        if (col > width-2) {
          right_bound = col;
        }
        else {
          right_bound = col+1;
        }

        let upper_bound = row-1;
        if (row == 0) {
          upper_bound = row;
        }
        else {
          upper_bound = row-1;
        }

        let lower_bound = row+1;
        if (row > height-2) {
          lower_bound = row;
        }
        else {
          lower_bound = row+1;
        }

        let num_neighbors = 0;

        console.log(row +","+col+": ub->" + upper_bound + " lb-> " + lower_bound + " rib-> " + right_bound + " leb-> " + left_bound);


        for (let row_2 = upper_bound; row_2 <= lower_bound; ++row_2) {
          for (let col_2 = left_bound; col_2 <= right_bound; ++col_2 ) {
            if((row_2 != row) || (col_2 != col)) {
              let cell_status_2 = this.board[row_2].props.children[col_2].props.status;
              console.log("*" + row_2 + "," + col_2 + ": " + cell_status_2);
              if (cell_status_2 === "alive") {
                num_neighbors+=1;
              }
            }
          }
        }

        console.log("Num Neighbors: " + num_neighbors);

        console.log("before checking: " + this.board[row].props.children[col].props.status);

        // Case 1
        if (cell_status === "alive" && num_neighbors < 2) {
          this.board[row].props.children[col].props.status = "dead";
          
        }
        else if (cell_status === "alive" && num_neighbors > 3) {
          this.board[row].props.children[col].props.status = "dead";

        }
        else if (cell_status === "alive" && num_neighbors <= 3 && num_neighbors >=2) {
          this.board[row].props.children[col].props.status = "alive";

        }
        else if (cell_status === "dead" && num_neighbors == 3) {
          this.board[row].props.children[col].props.status = "alive";

        }

        console.log(this.board[row]);
        //this.board[row].props.children[col].setState({living: "blue"});

        console.log("after checking: " + this.board[row].props.children[col].props.status);
        //console.log(this.board[row].props.children[col]);

      }
    }

    
  }

  render() {
    return (
      <div>
        {this.board}
        {this.checkNeighbors()}
      </div>
    );
  }
}

class Game extends React.Component {
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


export default Game;
