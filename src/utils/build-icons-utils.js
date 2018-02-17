const path = require("path");
const ICON_REGEXP = new RegExp(/([a-z]*)(_)(.*?)(_)(.*?)(_)([a-z]*)/, "i");

// Return filename. Also renames banks
const getFilename = iconPath => {
  return path.basename(iconPath, "icon");
};

module.exports = {
  ICON_REGEXP,
  getFilename
};
