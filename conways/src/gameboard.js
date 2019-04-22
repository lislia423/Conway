import React, { Component } from 'react';
import './gameboard.scss';

class Cell extends React.Component {
    constructor(props) {
        super(props);
        props = {
            coord: [],
            status: "dead"
        }
    }
    //cited from https://codepen.io/hadaclay/pen/YZKBpY
    changeColorOnClick = () => {
        return(
            this.props.changeColor(this.props.coord)
        )
    }
    render(){
        return(
            <td className={this.props.status} onClick={this.changeColorOnClick} value={this.props.coord}></td>
        )
    }
}

//Gameboard class
class Gameboard extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            width: 50,
            height: 50,
            interval: 100,
            cellMap: new Map(),
            generation: 0,
            running: false
        }
 
    }

    //change cell color and state when the cell is clicked on
    //cited from https://codepen.io/hadaclay/pen/YZKBpY
    changeCellColor = (c) =>{
        let newM = this.state.cellMap;
        let cellClicked = newM[c];
        if(cellClicked === "dead"){
            newM[c] = "alive";
        }
        else{
            newM[c] = "dead";
        }
        this.setState({cellMap: newM});
    }

    //returns a cell with random status
    renderCell(c){
        let s = "";
        let random = Math.floor(Math.random()*Math.floor(4));
        if(random > 2){
            s = "alive";
        }
        else{
            s = "dead";
        }

        return <Cell coord = {c} status = {s} changeColor={this.changeCellColor} />;

    }

    //returns a dead cell
    renderDeadCell(c){
        return <Cell coord = {c} status = "dead" changeColor={this.changeCellColor} />;
    }

    //returns a dead cell
    renderAliveCell(c){
        return <Cell coord = {c} status = "alive" changeColor={this.changeCellColor} />;
    }
    
    //create a board of cells
    createBoard = () =>{
        let gameboard_emp = [];
        
        for(let i = 0; i < this.state.height; ++i){
            let rowCell = [];
            for(let j = 0; j < this.state.width; ++j){
                rowCell.push(<Cell coord = {[i,j]} status = {this.state.cellMap[[i,j]]} changeColor={this.changeCellColor} />);             
            }
            gameboard_emp.push(<tr className="board-row">{rowCell}</tr>);
        }
        
        return gameboard_emp;
      }
    
    //generate random board
    randomBoard = () =>{
        let gameboard_mf = [];
        let newMap = this.state.cellMap;
        for(let i = 0; i < this.state.height; ++i){
            let rowCells = [];
            for(let j = 0; j < this.state.width; ++j){
                let c = this.renderCell([i,j]);
                newMap[[i,j]] = c.props.status;
                rowCells.push(c);
            }
            gameboard_mf.push(<tr className="board-row">{rowCells}</tr>);
        }
        this.setState({cellMap: newMap, generation: 0});
       
    }

    //checks and returns number of neighbors of a cell
    checkNeighbors = (c) =>{
        
        let tempMap = this.state.cellMap;
        let row = c[0];
        let col = c[1];

        //set boundaries for checking neighbors
        let left_bound = col - 1;
        if (col === 0) {
            left_bound = col;
        }

        let right_bound = col + 1;
        if (col > this.state.width - 2) {
            right_bound = col;
        }

        let upper_bound = row - 1;
        if (row === 0) {
            upper_bound = row;
        }

        let lower_bound = row + 1;
        if (row > this.state.height - 2) {
            lower_bound = row;
        }
        let num_neighbors = 0;

        for (let i = upper_bound; i <= lower_bound; ++i) {
            for (let j = left_bound; j <= right_bound; ++j) {
                if ((i !== row) || (j !== col)) {
                    let arr = [i,j]
                    let cell_status = tempMap[arr];
                    if (cell_status === 'alive') {
                        num_neighbors += 1;
                    }
                }
            }
        }
        return num_neighbors;

    }

    //main game logic
    gameLogic = () =>{

        //making a deep copy of this.state.cellMap
        let temp = new Map();
        for (let i = 0; i < this.state.height; ++i) {
            for (let j = 0; j < this.state.width; ++j) {
                temp[[i,j]] = this.state.cellMap[[i,j]];
            }
        }
       
        for(let i = 0; i < this.state.height; i++){
            for(let j = 0; j < this.state.width; j++){
                let numLiveNeighbors = this.checkNeighbors([i,j]);
                let currentCell = this.state.cellMap[[i,j]];
                if(currentCell === "alive" && numLiveNeighbors < 2){
                    temp[[i,j]] = "dead";
                }
                else if(currentCell === "alive" && numLiveNeighbors > 3){
                    temp[[i,j]] = "dead";
                }
                else if(currentCell === "alive" && numLiveNeighbors <= 3 && numLiveNeighbors >= 2){
                    temp[[i,j]] = "alive";
                }
                else if(currentCell === "dead" && numLiveNeighbors === 3){
                    temp[[i,j]] = "alive";
                }
            }
        }
        //update generations
        let updateGeneration = this.state.generation;
        updateGeneration+=1;
        this.setState({cellMap: temp, generation: updateGeneration}); 
    }

  //update board width
  widthChange = (e) =>{  
    if(this.state.running){
        alert("Please stop the game before changing board size. (Max board size is 50x50)");
    }
    else{
        this.setState({width: e.target.value});
        this.createBoard();
    }
  }

  //update board height
  heightChange = (e) =>{
    if(this.state.running){
        alert("Please stop the game before changing board size. (Max board size is 50x50)");
    }
    else{
        this.setState({height: e.target.value});
        this.createBoard();
    }
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

  //step through game
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

  //clear gameboard and generations
  clear = () =>{
    let newCellMap = this.state.cellMap;
    let gameboard_m = []
    for(let i = 0; i < this.state.height; ++i){
        let rowCells = [];
        for(let j = 0; j < this.state.width; ++j){
            let c = this.renderDeadCell([i,j]);
            let c_status = "dead";
            rowCells.push(c);
            newCellMap[[i,j]] = c_status;
        }
        gameboard_m.push(<tr className="board-row">{rowCells}</tr>)
    }
      this.setState({cellMap: newCellMap, generation: 0});
  
 
  }

  //generates gosper glider gun pattern
  gosper = () =>{
    this.clear();
    let newMap = this.state.cellMap;

    if (this.state.width >= 36 && this.state.height >= 23) {
        newMap[[5, 1]] = "alive";
        newMap[[6, 1]] = "alive";
        newMap[[5, 2]] = "alive";
        newMap[[6, 2]] = "alive";

        newMap[[3, 13]] = "alive";
        newMap[[3, 14]] = "alive";
        newMap[[4, 12]] = "alive";
        newMap[[4, 16]] = "alive";
        newMap[[5, 11]] = "alive";
        newMap[[5, 17]] = "alive";
        newMap[[6, 11]] = "alive";
        newMap[[6, 15]] = "alive";
        newMap[[6, 17]] = "alive";
        newMap[[6, 18]] = "alive";
        newMap[[7, 11]] = "alive";
        newMap[[7, 17]] = "alive";
        newMap[[8, 12]] = "alive";
        newMap[[8, 16]] = "alive";
        newMap[[9, 13]] = "alive";
        newMap[[9, 14]] = "alive";

        newMap[[1, 25]] = "alive";
        newMap[[2, 23]] = "alive";
        newMap[[2, 25]] = "alive";
        newMap[[3, 21]] = "alive";
        newMap[[3, 22]] = "alive";
        newMap[[4, 21]] = "alive";
        newMap[[4, 22]] = "alive";
        newMap[[5, 21]] = "alive";
        newMap[[5, 22]] = "alive";
        newMap[[6, 23]] = "alive";
        newMap[[6, 25]] = "alive";
        newMap[[7, 25]] = "alive";

        newMap[[3, 35]] = "alive";
        newMap[[3, 36]] = "alive";
        newMap[[4, 35]] = "alive";
        newMap[[4, 36]] = "alive";

    }
    else {
        alert("Your height must be greater than 23 and your width must be greater than 36 to run this pattern");
    }

    this.setState({cellMap: newMap, generation: 0, interval: 100});

  }

  //generates pentadecathlon pattern
  penta = () =>{
    this.clear();
    let newMap = this.state.cellMap;

    let middleRow = this.state.height/2;
    let middleWidth = this.state.width/2;

    if (this.state.width >= 10 && this.state.height >=3) {
        newMap[[middleRow, middleWidth-5]] = "alive";
        newMap[[middleRow, middleWidth-4]] = "alive";
        newMap[[middleRow + 1, middleWidth-3]] = "alive";
        newMap[[middleRow - 1, middleWidth-3]] = "alive";
        newMap[[middleRow, middleWidth-2]] = "alive";
        newMap[[middleRow, middleWidth-1]] = "alive";
        newMap[[middleRow, middleWidth]] = "alive";
        newMap[[middleRow, middleWidth+1]] = "alive";
        newMap[[middleRow + 1, middleWidth+2]] = "alive";
        newMap[[middleRow - 1, middleWidth+2]] = "alive";
        newMap[[middleRow, middleWidth+3]] = "alive";
        newMap[[middleRow, middleWidth+4]] = "alive";
    }
    else {
        alert("The pattern is too big for this board size!");
    }
    
    this.setState({cellMap: newMap, generation: 0, interval: 100});
  }

  // This method makes the board a pulsar pattern
  pulsar = () =>{
    this.clear();
    let newMap = this.state.cellMap;

    let middleRow = this.state.height/2;
    let middleWidth = this.state.width/2;

    //inputting cell pattern
    if (this.state.height >= 16 && this.state.width >= 16) {
        newMap[[middleRow - 6, middleWidth-2]] = "alive";
        newMap[[middleRow - 6, middleWidth-3]] = "alive";
        newMap[[middleRow - 6, middleWidth-4]] = "alive";

        newMap[[middleRow - 6, middleWidth+2]] = "alive";
        newMap[[middleRow - 6, middleWidth+3]] = "alive";
        newMap[[middleRow - 6, middleWidth+4]] = "alive";

        newMap[[middleRow - 1, middleWidth-2]] = "alive";
        newMap[[middleRow - 1, middleWidth-3]] = "alive";
        newMap[[middleRow - 1, middleWidth-4]] = "alive";

        newMap[[middleRow - 1, middleWidth+2]] = "alive";
        newMap[[middleRow - 1, middleWidth+3]] = "alive";
        newMap[[middleRow - 1, middleWidth+4]] = "alive";

        newMap[[middleRow + 6, middleWidth-2]] = "alive";
        newMap[[middleRow + 6, middleWidth-3]] = "alive";
        newMap[[middleRow + 6, middleWidth-4]] = "alive";

        newMap[[middleRow + 6, middleWidth+2]] = "alive";
        newMap[[middleRow + 6, middleWidth+3]] = "alive";
        newMap[[middleRow + 6, middleWidth+4]] = "alive";

        newMap[[middleRow + 1, middleWidth-2]] = "alive";
        newMap[[middleRow + 1, middleWidth-3]] = "alive";
        newMap[[middleRow + 1, middleWidth-4]] = "alive";

        newMap[[middleRow + 1, middleWidth+2]] = "alive";
        newMap[[middleRow + 1, middleWidth+3]] = "alive";
        newMap[[middleRow + 1, middleWidth+4]] = "alive";


        /// Columns
        newMap[[middleRow + 2, middleWidth-1]] = "alive";
        newMap[[middleRow + 3, middleWidth-1]] = "alive";
        newMap[[middleRow + 4, middleWidth-1]] = "alive";

        newMap[[middleRow + 2, middleWidth+1]] = "alive";
        newMap[[middleRow + 3, middleWidth+1]] = "alive";
        newMap[[middleRow + 4, middleWidth+1]] = "alive";

        newMap[[middleRow - 2, middleWidth-1]] = "alive";
        newMap[[middleRow - 3, middleWidth-1]] = "alive";
        newMap[[middleRow - 4, middleWidth-1]] = "alive";

        newMap[[middleRow - 2, middleWidth+1]] = "alive";
        newMap[[middleRow - 3, middleWidth+1]] = "alive";
        newMap[[middleRow - 4, middleWidth+1]] = "alive";

        //rows
        newMap[[middleRow + 2, middleWidth-6]] = "alive";
        newMap[[middleRow + 3, middleWidth-6]] = "alive";
        newMap[[middleRow + 4, middleWidth-6]] = "alive";

        newMap[[middleRow + 2, middleWidth+6]] = "alive";
        newMap[[middleRow + 3, middleWidth+6]] = "alive";
        newMap[[middleRow + 4, middleWidth+6]] = "alive";

        newMap[[middleRow - 2, middleWidth-6]] = "alive";
        newMap[[middleRow - 3, middleWidth-6]] = "alive";
        newMap[[middleRow - 4, middleWidth-6]] = "alive";

        newMap[[middleRow - 2, middleWidth+6]] = "alive";
        newMap[[middleRow - 3, middleWidth+6]] = "alive";
        newMap[[middleRow - 4, middleWidth+6]] = "alive";

    }
    else {
        alert("Your board size is not big enough for this pattern")
    }

    this.setState({cellMap: newMap, generation: 0, interval: 100});

  }

 
  //initial rendering data fetch
  componentWillMount = () => {
    this.randomBoard();
    let interval = setInterval(this.gameLogic, this.state.interval);
    this.setState({running: true, interval: interval});
}

    render() {
        return(
            <div className="container">
                <div className="title">
                <h1>Conway's Game of Life</h1>
                </div>
                <div className="game">
                <table className="board">
                    <tbody>
                    {this.createBoard()}
                    </tbody>
                </table>
                </div>
                <br></br>
                <div className="generations">
                    <h3>Generation: {this.state.generation}</h3>
                </div>
                <br></br>
                <div className="toolbar">
                    <label> Board Width: 
                        <input type="text" onChange={this.widthChange} readOnly={this.state.running}></input>
                    </label>
                    <label> Board Height: 
                        <input type="text" onChange={this.heightChange} readOnly={this.state.running}></input>
                    </label>
                    <label> Intervals: 
                        <input type="text" onChange={this.intervalChange}></input>
                    </label>
                    <br></br>
                    <br></br>
                    <button onClick={this.gosper}>Gosper Glider Gun</button>
                    <button onClick={this.penta}>Pentadecathlon</button>
                    <button onClick={this.pulsar}>Pulsar</button>
                    <br></br>
                    <br></br>
                    <button onClick={this.run}>Run</button>
                    <button onClick={this.stop}>Stop</button>
                    <button onClick={this.step}>Step</button>
                    <button onClick={this.randomBoard}>Randomize</button>
                    <button onClick={this.clear}>Clear</button>
                    <br></br>
                    <br></br>
                    <br></br>
                </div>
            </div>
        )
    }
}



export default Gameboard;
