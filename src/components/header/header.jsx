import React, { Component } from 'react';
import Type from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Input from 'arui-feather/input';
import Select from 'arui-feather/select';

import './header.css';

import { filterSearch, filterColor, filterSize } from '../../actions/app';

const mapStateToProps = ({ app, routing }) => {
  return {
    view: app.sidebarView,
    route: routing.location && routing.location.pathname,
    htmlExport: app.htmlExport
  };
};

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(
      {
        filterSearch,
        filterColor,
        filterSize
      },
      dispatch
    )
  };
};

const COLORS = [
  { value: 'all', text: 'Все' },
  { value: 'black', text: 'Черные' },
  { value: 'white', text: 'Белые' }
];

const SIZES = [
  { value: 'all', text: 'Все' },
  { value: 's', text: 'S' },
  { value: 'm', text: 'M' },
  { value: 'l', text: 'L' },
  { value: 'xl', text: 'XL' },
  { value: 'xxl', text: 'XXL' }
];

// @connect(mapStateToProps, mapDispatchToProps)
class Header extends Component {
  static propTypes = {
    actions: Type.shape({
      filterSearch: Type.func,
      filterColor: Type.func,
      filterSize: Type.func
    })
  };

  handleFilterColor = color => {
    this.props.actions.filterColor(color);
  };

  handleFilterSize = size => {
    this.props.actions.filterSize(size);
  };

  handleFilerSearch = query => {
    this.props.actions.filterSearch(query);
  };

  render() {
    return (
      <header className="header">
        <Input
          className={'search header__search'}
          placeholder={'Поиск'}
          width={'available'}
          size={'l'}
        />
        <Select
          className={'header__size'}
          mode={'radio'}
          size={'l'}
          options={SIZES}
          equalPopupWidth={true}
        />
        <Select
          className={'header__color'}
          mode={'radio'}
          size={'l'}
          options={COLORS}
          equalPopupWidth={true}
        />
      </header>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
