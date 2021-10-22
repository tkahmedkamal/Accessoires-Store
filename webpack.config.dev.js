const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
	mode: "development",
	entry: "./src/js/app.js",
	output: {
		filename: "bundle.js",
		path: path.resolve(__dirname, "./dist"),
		publicPath: "",
	},
	devtool: "eval-cheap-module-source-map",

	devServer: {
		static: path.resolve(__dirname, "./dist"),
		port: 9000,
		open: true,
		devMiddleware: {
			writeToDisk: true,
		},
	},

	module: {
		rules: [
			{
				test: /\.(png|jpg|jpeg|cur)$/,
				use: ["file-loader"],
			},
			{
				test: /\.scss$/,
				use: ["style-loader", "css-loader", "sass-loader"],
			},
			{
				test: /\.html$/,
				use: {
					loader: "html-loader",
				},
			},
			{
				test: /\.js$/,
				exclude: "/node_modules",
				use: {
					loader: "babel-loader",
					options: {
						presets: ["@babel/env"],
					},
				},
			},
		],
	},

	plugins: [
		new CleanWebpackPlugin(),
		new HtmlWebpackPlugin({
			template: "./src/index.html",
		}),
		new CopyPlugin({
			patterns: [
				{
					from: path.resolve(__dirname, "./src/images"),
					to: path.resolve(__dirname, "./dist/images"),
				},
			],
		}),
	],
};
