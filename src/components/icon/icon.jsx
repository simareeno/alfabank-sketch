import React, { Component } from "react";
import Type from "prop-types";
import "./icon.css";

export default class Category extends Component {
  static propTypes = {
    name: Type.string.isRequired,
    size: Type.string.isRequired,
    color: Type.string.isRequired,
    colored: Type.bool.isRequired,
    category: Type.string.isRequired,
    fileName: Type.string.isRequired
  };

  state = {
    loaded: false,
    image: ""
  };

  componentDidMount() {
    this.loadImage();
  }

  loadImage() {
    import(`alfa-ui-primitives/icons/${this.props.category}/${
      this.props.fileName
    }`)
      .then(imageFile =>
        this.setState({
          image: imageFile
        })
      )
      .catch(error => {
        console.error(error);
      });
  }

  render() {
    const { name, size, color, colored, category, fileName } = this.props;

    return (
      <div className="icon">
        <img className="icon__image" src={this.state.image} alt={name} />
      </div>
    );
  }
}
