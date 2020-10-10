const path = require('path');
const webpack = require('webpack');

const LessAutoprefix = require('less-plugin-autoprefix');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const packageJson = require('./package.json');
const vendorDependencies = Object.keys(packageJson['dependencies']);

const autoprefix = new LessAutoprefix({ browsers: ['last 2 versions']});

const babelOpts = {
	presets: ['@babel/preset-env', '@babel/preset-react'],
	cacheDirectory: true
}

const devMode = true;

const plugins = [
  new MiniCssExtractPlugin({
    filename: 'css/[name].css'
  }),
];

module.exports = {
	context: __dirname,
	
  entry: {
		app: path.join(__dirname, 'src/js', 'main.tsx'),
		libs: vendorDependencies,
		pages: path.join(__dirname, 'src/pages', 'index.html'),
		styles: path.join(__dirname, 'src/css', 'main.less')
	},

	plugins,

	module: {
		rules: [

			/* 
				TS
			 */
			{
				test: /\.ts(x?)$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'babel-loader',
						options: babelOpts
					},
					{
						loader: 'ts-loader'
					}
				]
			},
			
			/* 
				BABEL FALLBACK
			 */
			{
				test: /\.js(x?)$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'babel-loader',
						options: babelOpts
					}
				]
			},

			/* 
				LESS
			 */
			{
				test: /\.(le|c)ss$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
							publicPath: path.join(__dirname, 'public/css'),
						},
					},
					{ 
						loader: 'css-loader',
						options: {
              sourceMap: true,
            },
					},
					{
						loader: 'less-loader',
						options: {
							sourceMap: false,
							lessOptions: {
								paths: ['.'],
								plugins: [autoprefix],
								rewriteUrls: 'all',
								rootpath: '/'
							}
						}
					}
				]
			},

			/* 
				HTML
			 */
			{
				test: /\.html$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: "[name].[ext]",
						}
					},
					{
						loader: 'extract-loader',
						options: {
							publicPath: path.join(__dirname, 'public')
						}
					},
					{
							loader: "html-loader",
							options: {
								attributes: false,
							}
					}
				]
			}
		]
	},

	resolve: {
		extensions: ['.ts', '.tsx', '.js', '.jsx']
	},

  output: {
    path: path.resolve(__dirname, './public'),
    filename: 'js/[name].js',
    chunkFilename: 'js/[chunkhash].js'
	},
	
	devServer: {
		contentBase: [path.join(__dirname, 'public'), path.join(__dirname, 'assets')],
		contentBasePublicPath: '/',
    compress: true,
		port: 8000,
		host: '0.0.0.0'
	}
}