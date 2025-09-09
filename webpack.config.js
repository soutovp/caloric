// webpack.config.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const SitemapWebpackPlugin = require('sitemap-webpack-plugin').default;

// --- DADOS PARA CADA PÁGINA ---
const indexData = {
	title: 'Caloric: Calculadora de Calorias e Macronutrientes',
	meta: {
		description: 'Calcule sua meta diária de calorias e macronutrientes de forma gratuita e precisa com o Caloric.',
		og: {
			/* ... seus dados de OG ... */
		},
		twitter: {
			/* ... seus dados de Twitter ... */
		},
	},
};

const sobreData = {
	title: 'Sobre nós | Caloric',
	meta: {
		description: 'Descubra a missão e a história por trás da ferramenta Caloric.',
	},
};

const privacidadeData = {
	title: 'Política de Privacidade | Caloric',
	meta: {
		description: 'Conheça nossa política de privacidade e como lidamos com seus dados.',
	},
};

// --- CONFIGURAÇÃO DO WEBPACK ---
module.exports = {
	entry: './src/js/script.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'bundle.js',
		clean: true,
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: 'babel-loader',
			},
			{
				test: /\.css$/,
				use: [MiniCssExtractPlugin.loader, 'css-loader'],
			},
			// {
			// 	test: /\.ejs$/,
			// 	use: [
			// 		{
			// 			loader: 'ejs-loader',
			// 			options: {
			// 				esModule: false,
			// 			},
			// 		},
			// 	],
			// },
		],
	},
	// Dentro do seu webpack.config.js

	// Dentro do seu webpack.config.js

	plugins: [
		new HtmlWebpackPlugin({
			// A MÁGICA ESTÁ AQUI: Forçamos o ejs-loader com as opções corretas
			template: '!!ejs-loader?{"esModule":false}!./src/index.ejs',
			filename: 'index.html',
			chunks: ['main'],
			templateParameters: indexData,
		}),
		new HtmlWebpackPlugin({
			template: '!!ejs-loader?{"esModule":false}!./src/sobre.ejs',
			filename: 'sobre.html',
			chunks: ['main'],
			templateParameters: sobreData,
		}),
		new HtmlWebpackPlugin({
			template: '!!ejs-loader?{"esModule":false}!./src/privacidade.ejs',
			filename: 'privacidade.html',
			chunks: ['main'],
			templateParameters: privacidadeData,
		}),
		new MiniCssExtractPlugin(),
		new SitemapWebpackPlugin({
			base: 'https://caloric.com.br',
			paths: ['/', '/sobre.html', '/privacidade.html'],
		}),
	],
	devServer: {
		static: './dist',
		port: 8080,
		open: true,
		hot: true,
		watchFiles: ['src/**/*.ejs'],
	},
};
