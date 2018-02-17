import React, { Component } from 'react';
import Type from 'prop-types';
import Icon from '../icon/icon';
import './category.css';

export default class Category extends Component {
  static propTypes = {
    category: Type.object,
    theme: Type.string
  };

  render() {
    return (
      <div className={'category'}>
        <div className={'category__icons'}>
          {this.props.category.items.map((icon, i) => (
            <Icon
              key={i}
              name={icon.name}
              size={icon.size}
              color={icon.color}
            />
          ))}
        </div>
      </div>
    );
  }
}
