import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';
import Game from './gameboard.js';

import './gameboard.css';

class App extends Component {
  render() {
    return (
      <div>
        <h1>heya</h1>
         <Game />
      </div>
    );
  }
}

export default App;
