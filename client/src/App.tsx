import React from 'react';
import logo from './logo.svg';
import './App.css';
import { getAllSensorData } from './api/sensorApiCalls';

function App() {

  const formatDateHandler = async () => {
    var a = await getAllSensorData();
    console.log(a)
  };
  formatDateHandler();
  
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
