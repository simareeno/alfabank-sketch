import React, { Component, Fragment } from 'react';
import Header from '../components/header/header';
import Icons from '../components/icons/icons';
import './App.css';
import iconsJSON from '../icons.json';

export default class App extends Component {
  render() {
    return (
      <Fragment>
        <Header />
        <Icons categories={iconsJSON} />
      </Fragment>
    );
  }
}
