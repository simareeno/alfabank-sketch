import React, { Component } from 'react';
import Type from 'prop-types';
import './icon.css';

export default class Icon extends Component {
  static propTypes = {
    name: Type.string.isRequired,
    size: Type.string.isRequired,
    color: Type.string.isRequired
  };

  state = {
    loaded: false
  };

  render() {
    const { name, size, color } = this.props;

    return (
      <div className="icon">
        <img
          className="icon__image"
          src={require(`../../images/icons/icon_${name}_${size}_${color}.svg`)}
          // src={`images/icons/icon_${name}_${size}_${color}.svg`}
          alt={name}
        />
      </div>
    );
  }
}
