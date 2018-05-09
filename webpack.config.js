var path = require('path');
var webpack = require('webpack');

module.exports = {
	context: __dirname,
	mode: "development",
	devtool: "source-map",
	entry: {
		libs:"./src/js/libs.js",
		main:"./src/js/main.js",
	},
	output: {
		path: path.resolve(__dirname, 'public'),
		filename: "[name]-bundle.js"
	},
	module: {
	  	rules: [
			{ test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
		]
 	},
	stats: {
		colors: true
	},
	resolve: {
		alias: {
			'vue$': 'vue/dist/vue.esm.js' // 'vue/dist/vue.common.js' для webpack 1
		}
	}
}