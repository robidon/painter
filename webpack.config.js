module.exports = {
  context: __dirname,
  devtool: "source-map",
  entry: "./src/js/main.js",
  output: {
    path: __dirname + "/public",
    filename: "bundle.js"
  }
}