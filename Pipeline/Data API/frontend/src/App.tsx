import React, { Component } from 'react';
import Dashboard from './Components/Dashboard.tsx';
import './App.css'



export default class App extends Component {
  render() {
    return (
      <React.Fragment>
        <div className="app-container">
          <Dashboard />
        </div>
      </React.Fragment>
    )
  }
}