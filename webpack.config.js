const path = require("path");

module.exports = {
  entry: [
    "./js/data.js",
    "./js/load.js",
    "./js/pin.js",
    "./js/card.js",
    "./js/form.js",
    "./js/debounce.js",
    "./js/filter.js",
    "./js/map.js",
    "./js/moving.js"
  ],
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname),
    iife: true,
  },
  devtool: false
};
