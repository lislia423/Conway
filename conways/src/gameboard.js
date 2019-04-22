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
        // this.clear();
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

  gosper = () =>{
    let leftBlock = this.state.cellMap
  }

  penta = () =>{
      
  }

  pulsar = () =>{
      
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
                <h1>Conway's Game of Life</h1>
                </div>
                <div className="game">
                <table class="board">
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
                    <br></br>
                    <br></br>
                    <label> Board Height: 
                        <input type="text" onChange={this.heightChange} readOnly={this.state.running}></input>
                    </label>
                    <br></br>
                    <br></br>
                    <label> Intervals: 
                        <input type="text" onChange={this.intervalChange}></input>
                    </label>
                    <br></br>
                    <br></br>
                    <select>
                        <option>--Select--</option>
                        <option onClick={this.gosper}>Gosper Glider Gun</option>
                        <option onClick={this.penta}>Pentadecathlon</option>
                        <option onClick={this.pulsar}>Pulsar</option>
                    </select>
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
