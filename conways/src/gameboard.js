import React, { Component } from 'react';
import './gameboard.css';

const CELL_SIZE = 20;
const WIDTH = 800;
const HEIGHT = 600;

class Gameboard extends React.Component {
  render() {
    return (
      <div>
        <div className="Board"
           style={{ width: WIDTH, height: HEIGHT }} >
        </div>
      </div>
    );
  }
}

export default Gameboard;