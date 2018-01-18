import React, { Component } from 'react';
import Type from 'prop-types';

import './icon.css';

export default class Category extends Component {
  static propTypes = {
    name: Type.string.isRequired,
    category: Type.string.isRequired,
    componentName: Type.string.isRequired
  };

  getFeatherIcon() {
    return 2;
  }

  render() {
    return (
      <div className={'icon'}>
        {this.getFeatherIcon}
        <div className={'icon__title'}>{this.props.name}</div>
      </div>
    );
  }
}
