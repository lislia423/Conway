import React, { Component } from 'react';
import './App.css';
import './gameboard.css';


//General app structure cited from 
//https://revs.runtime-revolution.com/implementing-conways-game-of-life-with-react-part-1-c0b974ae33eb
//and https://codepen.io/hadaclay/pen/YZKBpY
class App extends Component {
  render(){
    return(
      <div className="game">
        <Gameboard />
      </div>
      
    )
  }
}
class Cell extends React.Component {
  constructor(props){
    super(props);
    props = {
      x: "",
      y: "",
      status: "dead"
    }
    this.changeColorOnClick = this.changeColorOnClick.bind(this);
  }
  changeColorOnClick = () =>{
    return(
      this.props.clickCell(this.props.x, this.props.y, this.props.status)
    )
  } 
  render() {
    return (
      <td className={this.props.status} onClick={this.changeColorOnClick}></td>
    );
  }
}

class Gameboard extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      boardWidth: 50,
      boardHeight: 50,
      running: false,
      status: "dead",
      generation: 0,
      cells: [],
      interval: 100
    }

    this.createBoard = this.createBoard.bind(this);
    this.randomBoard = this.randomBoard.bind(this);
    this.widthChange = this.widthChange.bind(this);
    this.heightChange = this.heightChange.bind(this);
    this.changeCellColor = this.changeCellColor.bind(this);
    this.gameLogic = this.gameLogic.bind(this);
    this.intervalChange = this.intervalChange.bind(this);
    this.run = this.run.bind(this);
    this.step = this.step.bind(this);
    this.stop = this.stop.bind(this);
    
  


  }
  //change cell color on click and update its living status
  changeCellColor = (r,c,s) =>{

    //cited from https://codepen.io/hadaclay/pen/YZKBpY
    // let newCellArray = this.state.cells.slice(0);
    let newCellArray = this.state.cells;
    let newS = "";

    if(s === "dead"){
      newS = "alive";
    }
    else{
      newS = "dead";
    }
    newCellArray[r][c].status = newS;
    this.setState({cells: newCellArray});
  }

  //create initial board
  createBoard = () =>{
    
    let gameboard = [];
    let arrayKey = 0;

    // Outer loop to create parent
    for (let i = 0; i < this.state.boardHeight; i++) {
      //Inner loop to create children
      let row_cells = [];
      for (let j = 0; j < this.state.boardWidth; j++) {    
        // this.state.cells[i].push(<Cell />);
        row_cells.push(<Cell key={arrayKey} x={i} y={j} clickCell={this.changeCellColor} status={this.state.cells[i][j].status}/>);        
        arrayKey+=1;
      }
      //Create the parent and add the children
      gameboard.push(<tr key={i}>{row_cells}</tr>);
    }
    return gameboard;
  }

  //create a random board
  randomBoard = () =>{
    let newCellArray = [];
    for(let i = 0; i < this.state.boardHeight; i++){
      let cellRows = [];
      for(let j = 0; j < this.state.boardWidth; j++){
        const randomStatus = Math.floor(Math.random() * Math.floor(4)) > 2 ? 'alive' : 'dead';
        cellRows.push({status: randomStatus});
      }
      newCellArray.push(cellRows);
    }
    this.setState({cells: newCellArray, generation: 0});

  }
  
  //structure cited from https://codepen.io/hadaclay/pen/YZKBpY
  //clear the current board and generations
  clearBoard = () => {
    let clearedBoard = [];
    for(let i = 0; i < this.state.boardHeight; i++){
      let cellRows = [];
      for(let j = 0; j < this.state.boardWidth; j++){
        cellRows.push({status: "dead"});
      }
      clearedBoard.push(cellRows);
    }
    this.setState({cells: clearedBoard, generation: 0});

  }
  
  //check and store neighbors of a cell
  checkNeighbors = (row,col,b) =>{
    //the use of a neighbors array is cited from https://codepen.io/hadaclay/pen/YZKBpY
    let neighbors = [];
    let width = this.state.boardWidth;
    let height = this.state.boardHeight;
    
    //Handle edge cases
        
        //top left
        if (col === 0 && row === 0) {
          neighbors = [
            b[row][col+1].status,
            b[row+1][col].status,
            b[row+1][col+1].status
          ];
        }
        //bottom left
        else if(col === 0 && row === height-1){
          neighbors = [
            b[row-1][col].status,
            b[row][col+1].status,
            b[row-1][col+1].status
          ];
        }
        //bottom right
        else if(col === width-1 && row === height-1){
          neighbors = [
            b[row][col-1].status,
            b[row-1][col].status,
            b[row-1][col-1].status
          ];
        }
        //top right
        else if(col === width-1 && row === 0){
          neighbors = [
            b[row][col-1].status,
            b[row+1][col].status,
            b[row+1][col].status
          ];
        }
        //leftmost column
        else if(col === 0){
          neighbors = [
            b[row-1][col].status,
            b[row-1][col+1].status,
            b[row][col+1].status,
            b[row+1][col+1].status,
            b[row+1][col].status
          ];
        }
        //rightmost column
        else if(col === width-1){
          neighbors = [
            b[row-1][col].status,
            b[row-1][col-1].status,
            b[row][col-1].status,
            b[row+1][col-1].status,
            b[row+1][col].status
          ];
        }
        //uppermost row
        else if(row === 0){
          neighbors = [
            b[row][col-1].status,
            b[row+1][col-1].status,
            b[row+1][col].status,
            b[row+1][col+1].status,
            b[row][col+1].status
          ];
        }
        //lowermost row
        else if(row === height-1){
          neighbors = [
            b[row][col-1].status,
            b[row-1][col-1].status,
            b[row-1][col].status,
            b[row-1][col+1].status,
            b[row][col+1].status
          ];
        }
        else{
          neighbors = [
            b[row][col-1].status,
            b[row-1][col-1].status,
            b[row-1][col].status,
            b[row-1][col+1].status,
            b[row][col+1].status,
            b[row+1][col+1].status,
            b[row+1][col].status,
            b[row+1][col-1].status
          ];
        }
        return neighbors;
      }

  //get number of alive neighbor cells
  getLiveNeighborNum = (n) =>{
    let numLive = 0;
    for (let i = 0; i < n.length; ++i){
      if(n[i] === "alive"){
        numLive+=1;
      }
    }
    return numLive;
  }

  //main game logic
  gameLogic = () =>{ 
    
    //JSON copy (not by reference) cited from https://codepen.io/hadaclay/pen/YZKBpY
    let newCellArray = JSON.parse(JSON.stringify(this.state.cells));

    for(let r = 0; r < this.state.boardHeight; ++r){
      for(let c = 0; c < this.state.boardWidth; ++c){
        let neighbors = this.checkNeighbors(r,c,this.state.cells);
        let currentCellStatus = this.state.cells[r][c].status;
        let numLiveNeighbors = this.getLiveNeighborNum(neighbors);
        
        if(currentCellStatus === "alive"){
          //Any live cell with fewer than two live neighbours dies
          if(numLiveNeighbors < 2){
            newCellArray[r][c].status = "dead";
          }
          //Any live cell with more than three live neighbours dies
          else if(numLiveNeighbors > 3){
            newCellArray[r][c].status = "dead";
          }
          //Any live cell with two or three live neighbours lives, unchanged, to the next generation. 
          else if(numLiveNeighbors === 2 || numLiveNeighbors === 3){
            newCellArray[r][c].status = "alive";

          }
        }
        else if(currentCellStatus === "dead"){
          //Any dead cell with exactly three live neighbours will come to life. 
          if(numLiveNeighbors === 3){
            newCellArray[r][c].status = "alive";
          }
          else{
            newCellArray[r][c].status = "dead";
          }
        }
      }
    }
    //update generations
    let updateGeneration = this.state.generation;
    updateGeneration+=1;
    this.setState({cells: newCellArray, generation: updateGeneration}); 
  }

  //update board width
  widthChange = (e) =>{  
    this.setState({boardWidth: e.target.value});
  }

  //update board height
  heightChange = (e) =>{
    this.setState({boardHeight: e.target.value});
  }

  //update rendering intervals
  intervalChange = (e) =>{
    if(this.state.running){
      alert("Please stop the game before changing intervals.");
    }
    else{
      this.setState({interval: e.target.value});
    }
  }

  //run game
  run = () => {
    if(!this.state.running){
      let interv = setInterval(this.gameLogic, this.state.interval);
      this.setState({running: true, interval: interv});
    }
  }

  step = () =>{
    if(this.state.running){
      alert("Please stop the game before stepping.");
    }
    else{
      this.gameLogic();
    }
  }
  //stop game
  stop = () => {
    if(this.state.running){
      this.setState({running: false});
      clearInterval(this.state.interval);
      this.setState({interval: 100});
    }
  }
  
  //initial rendering data fetch
  componentWillMount = () => {
    this.randomBoard(); 
    let interval = setInterval(this.gameLogic, this.state.interval);
    this.setState({running: true, interval: interval});
}

  render() {
    return(
      <div>
        <div className="title">
          <h2>Conway's Game of Life</h2>
        </div>
        <div className="gameboard">     
            <table>
              <tbody>
                {this.createBoard()}
              </tbody>
            </table>
        </div>
        <div className="generations">
        <h4>Generations: {this.state.generation}</h4>
        </div>
        <div className="toolBar">
          <label> Width:
            <input type="text" onChange={this.widthChange}></input>
          </label>
          <br></br>
          <br></br>
          <label> Height: 
            <input type="text" onChange={this.heightChange}></input>
          </label>
          <br></br>
          <br></br>
          <label> Interval: 
            <input type="text" onChange={this.intervalChange}></input>
          </label>
          <br></br>
          <br></br>
          <button onClick={this.run}>Run</button>
          <button onClick={this.stop}>Stop</button>
          <button onClick={this.step}>Step</button>
          <button onClick={this.clearBoard}>Clear</button>
          <button onClick={this.randomBoard}>Randomize</button>
        </div>
      </div>
    )
  }
}


export default App;
