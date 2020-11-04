const path = require("path");

module.exports = {
  entry: [
    "./js/load.js",
    "./js/pin.js",
    "./js/card.js",
    "./js/form.js",
    "./js/debounce.js",
    "./js/map.js",
    "./js/filter.js",
    "./js/moving.js"
  ],
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname),
    iife: true,
  },
  devtool: false
};
