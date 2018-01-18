import React, { Component } from 'react';
import Type from 'prop-types';

import Category from '../category/category';

import './icons.css';

export default class Icons extends Component {
  static propTypes = {
    categories: Type.object
  };

  render() {
    return (
      <div className={'icons'}>
        {this.props.categories.icons.map((category, i) => (
          <Category key={i} icons={category} />
        ))}
      </div>
    );
  }
}
