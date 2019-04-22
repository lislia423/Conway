import React, { Component } from 'react';
import './App.scss';
import './gameboard.scss';
import Gameboard from './gameboard.js';


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


export default App;
