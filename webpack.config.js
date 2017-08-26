module.exports = {
	module: {
		rules: [
			{
				test: /\.json$/,
				use: 'json-loader'
			}
		]
	},
	output: {
		filename: "demo.js",
	},
}
