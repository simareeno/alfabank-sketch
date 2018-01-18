import React, { Component } from 'react';
import Type from 'prop-types';

import Icon from '../icon/icon';

import './category.css';

export default class Category extends Component {
  static propTypes = {
    icons: Type.array
  };

  render() {
    return (
      <div className={'category'}>
        {this.props.icons.map((icon, i) => (
          <Icon
            key={i}
            name={icon.name}
            category={icon.category}
            componentName={icon.componentName}
          />
        ))}
      </div>
    );
  }
}
