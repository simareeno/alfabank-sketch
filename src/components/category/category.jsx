import React, { Component } from "react";
import Type from "prop-types";
import Icon from "../icon/icon";
import "./category.css";

export default class Category extends Component {
  static propTypes = {
    icons: Type.object,
    theme: Type.string
  };

  render() {
    console.log(this.props.icons);
    return (
      <div className={"category"}>
        <div className={"category__icons"}>
          {this.props.icons.map((icon, i) => (
            <Icon
              key={i}
              name={icon.name}
              size={icon.size}
              color={icon.color}
              colored={icon.colored}
              category={icon.category}
              fileName={icon.fileName}
            />
          ))}
        </div>
      </div>
    );
  }
}
