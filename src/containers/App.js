import React, { Component, Fragment } from "react";
import Type from "prop-types";
import Header from "../components/header/header";
import Icons from "../components/icons/icons";
import "./App.css";
import iconsJSON from "../icons.json";

export default class App extends Component {
  static propTypes = {
    categories: Type.array
  };

  static defaultProps = {
    categories: iconsJSON.categories
  };

  render() {
    return (
      <Fragment>
        <Header />
        <Icons categories={this.props.categories} />
      </Fragment>
    );
  }
}
