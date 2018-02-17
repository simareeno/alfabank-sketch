const rewireProvidePlugin = require("react-app-rewire-provide-plugin");

module.exports = function override(config, env) {
  config = rewireProvidePlugin(config, env, { React: "react" });
  return config;
};
