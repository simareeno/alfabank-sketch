import React, { Component } from "react";
import Type from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Input from "arui-feather/input";
import Select from "arui-feather/select";

import "./header.css";

import { filterSearch, filterColor, filterSize } from "../../actions/app";

const mapStateToProps = state => {
  return {
    actions: state
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
  { value: "all", text: "Все" },
  { value: "black", text: "Черные" },
  { value: "white", text: "Белые" }
];

const SIZES = [
  { value: "all", text: "Все" },
  { value: "s", text: "S" },
  { value: "m", text: "M" },
  { value: "l", text: "L" },
  { value: "xl", text: "XL" },
  { value: "xxl", text: "XXL" }
];

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

  handleFilterSearch = query => {
    this.props.actions.filterSearch(query);
  };

  render() {
    return (
      <header className="header">
        <Input
          className={"search header__search"}
          placeholder={"Поиск"}
          width={"available"}
          size={"l"}
          onChange={value => this.handleFilterSearch(value)}
        />
      </header>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
