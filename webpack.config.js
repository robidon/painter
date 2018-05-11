var path = require('path');
var webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
	context: __dirname,
	mode: "development",
	devtool: "source-map",
	entry: {
		libs:"./src/Libs.js",
		main:"./src/Main.js",
		generator:"./src/Generator.js"
	},
	output: {
		path: path.resolve(__dirname, 'public'),
		filename: "[name]-bundle.js"
	},
	module: {
	  	rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: "babel-loader"
			},
			{
	        	test: /\.vue$/,
	        	loader: 'vue-loader'
	        },
	        {
				test: /\.css$/,
				use: [
					'vue-style-loader',
					'css-loader'
				]
			}
		]
 	},
	stats: {
		colors: true
	},
	resolve: {
		alias: {
			'vue$': 'vue/dist/vue.esm.js' // 'vue/dist/vue.common.js' для webpack 1
		}
	},
	plugins: [
		new VueLoaderPlugin()
	]
}