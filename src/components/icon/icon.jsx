import React, { Component } from 'react';
import Input from 'arui-feather/input';
import Select from 'arui-feather/select';

import './icon.css';

const COLORS = [
  { value: 'all', text: 'Все' },
  { value: 'black', text: 'Черный' },
  { value: 'white', text: 'Белый' }
];

const SIZES = [
  { value: 'all', text: 'Все' },
  { value: 's', text: 'S' },
  { value: 'm', text: 'M' },
  { value: 'l', text: 'L' },
  { value: 'xl', text: 'XL' },
  { value: 'xxl', text: 'XXL' }
];

export default class Header extends Component {
  render() {
    return <div>{this.renderContent()}</div>;
  }

  renderContent() {
    return (
      <header className="header">
        <div className="header__search">
          <Input className={'search'} placeholder={'Поиск'} />
        </div>
        <Select
          width={'available'}
          mode={'radio'}
          options={SIZES}
          equalPopupWidth={true}
        />
        <Select
          width={'available'}
          mode={'radio'}
          options={COLORS}
          equalPopupWidth={true}
        />
      </header>
    );
  }
}
