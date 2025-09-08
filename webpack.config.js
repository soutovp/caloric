// webpack.config.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { title } = require('process');
const SitemapWebpackPlugin = require('sitemap-webpack-plugin').default;

const paths = ['/', '/sobre'];

// DEFINIMOS OS NOSSOS DADOS AQUI, NUM SÓ LUGAR
const templateData = {
	title: 'Caloric: Calculadora de Calorias e Macronutrientes',
	meta: {
		description: 'Calcule sua meta diária de calorias e macronutrientes de forma gratuita e precisa com o Caloric.',
		og: {
			type: 'website',
			url: 'https://caloric.com.br/',
			title: 'Caloric: Calculadora de Calorias e Macronutrientes',
			description: 'Calcule suas metas diárias de calorias e macros de forma gratuita e precisa.',
			image: '',
		},
		twitter: {
			card: 'summary_large_image',
			url: 'https://caloric.com.br',
			title: 'Caloric: Calculadora de Calorias e Macronutrientes',
			description: 'Calcule suas metas diárias de calorias e macros de forma gratuita e precisa.',
		},
	},
};

module.exports = {
	entry: './src/js/index.js',
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
			{
				test: /\.ejs$/,
				use: [
					'html-loader',
					{
						loader: 'ejs-plain-loader',
						// A CORREÇÃO ESTÁ AQUI:
						options: {
							// Passamos os nossos dados diretamente para o loader
							data: templateData,
						},
					},
				],
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './src/index.ejs',
			// inject: 'body',
			filename: 'index.html',
			chunks: ['main'],
			customData: templateData,
		}),
		new HtmlWebpackPlugin({
			template: './src/sobre.ejs',
			filename: 'sobre.html',
			chunks: ['main'],
			customData: {
				title: 'Sobre nós | Caloric',
				meta: {
					description: 'Descubra a missão e a história por trás da ferramenta Caloric.',
				},
			},
		}),
		new MiniCssExtractPlugin(),
		new SitemapWebpackPlugin({
			base: 'https://caloric.com.br',
			paths,
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
