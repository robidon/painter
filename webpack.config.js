module.exports = {
  context: __dirname,
  mode: "development",
  devtool: "source-map",
  entry: {
  	libs:"./src/js/libs.js",
  	main:"./src/js/main.js",
  },
  output: {
    path: __dirname + "/public",
    filename: "[name]-bundle.js"
  },
  module: {
    loaders: [
    	{ test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
    ]
  }
}