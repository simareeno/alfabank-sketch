import React, { Component, Fragment } from 'react';

import Header from '../components/header/header';

import './App.css';

class App extends Component {
  render() {
    return (
      <Fragment>
        <Header />
        <div className="icons icons--size-m" />
      </Fragment>
    );
  }
}

export default App;
