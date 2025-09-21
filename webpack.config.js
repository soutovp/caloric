// webpack.config.js
const path = require('path');
const fs = require('fs'); // Módulo nativo do Node.js para ler ficheiros
const ejs = require('ejs'); // O motor do EJS que instalámos
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const SitemapWebpackPlugin = require('sitemap-webpack-plugin').default;
const CopyWebpackPlugin = require('copy-webpack-plugin');

const paths = ['/', '/sobre.html', '/privacidade.html', '/blog/calculo.html'];

const generateHtml = (templatePath, data) => {
  const absoluteTemplatePath = path.resolve(__dirname, templatePath);
  const template = fs.readFileSync(absoluteTemplatePath, 'utf-8');

  // Renderiza com o EJS
  return ejs.render(template, data, {
    filename: absoluteTemplatePath,
  });
};

module.exports = {
	entry: {
		main: './src/js/app.js',
		index: './src/js/index.js',
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: '[name].bundle.js',
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
			// JÁ NÃO PRECISAMOS DE UMA REGRA PARA EJS AQUI!
		],
	},
	plugins: [
		// --- PÁGINA INICIAL ---
		new HtmlWebpackPlugin({
			filename: 'index.html',
			chunks: ['main', 'index'],
			inject: 'body',
			templateContent: generateHtml('./src/index.ejs', {
				title: 'Caloric: Calculadora de Calorias, Macros e IMC Precisa',
				lang: 'pt-br',
				canonicalUrl: 'https://caloric.com.br/',
				meta: {
					description: 'Calcule com precisão a sua necessidade diária de calorias, macronutrientes (proteínas, carboidratos, gorduras) e IMC com base no seu objetivo. Ferramenta online e gratuita.',
					keywords: 'calculadora de calorias, calcular tmb, gasto calórico, macronutrientes, dieta, imc, emagrecer, ganhar massa muscular',
					robots: 'index, follow',
					themeColor: '#0D47A1',
				},
				og: {
					title: 'Caloric: A Sua Calculadora de Nutrientes Essencial',
					description: 'Descubra as suas metas de calorias e macros para atingir os seus objetivos de saúde e fitness.',
					type: 'website',
					url: 'https://caloric.com.br/',
					image: 'https://caloric.com.br/assets/caloric-social-preview.png',
					siteName: 'Caloric',
				},

				twitter: {
					// Tags para o Twitter
					card: 'summary_large_image',
					title: 'Caloric: A Sua Calculadora de Nutrientes Essencial',
					description: 'Descubra as suas metas de calorias e macros para atingir os seus objetivos de saúde e fitness.',
					image: 'https://caloric.com.br/assets/caloric-social-preview.png',
				},
			}),
		}),
		// --- PÁGINA SOBRE ---
		new HtmlWebpackPlugin({
			filename: 'sobre.html',
			chunks: ['main'],
			inject: 'body',
			templateContent: generateHtml('./src/sobre.ejs', {
				// --- Início das Meta Tags Otimizadas para a página SOBRE ---

				title: 'Sobre o Caloric | A Nossa Missão',
				lang: 'pt-br',
				// URL Canónica específica para esta página
				canonicalUrl: 'https://caloric.com.br/sobre.html',
				meta: {
					description: 'Descubra a história e a missão por trás do Caloric, a sua ferramenta gratuita para uma vida mais saudável e consciente da sua nutrição.',
					keywords: 'sobre caloric, missão caloric, ferramenta de saúde, nutrição, bem-estar',
					robots: 'index, follow',
					themeColor: '#0D47A1',
				},
				og: {
					// Tags para partilha em redes sociais
					title: 'A Missão do Caloric: Simplificar a Sua Jornada de Saúde',
					description: 'Conheça a visão por trás da nossa ferramenta e como queremos ajudá-lo a atingir os seus objetivos.',
					type: 'website',
					// URL específica para esta página
					url: 'https://caloric.com.br/sobre.html',
					image: 'https://caloric.com.br/assets/caloric-social-preview.png',
					siteName: 'Caloric',
				},
				twitter: {
					// Tags para o Twitter
					card: 'summary_large_image',
					title: 'A Missão do Caloric: Simplificar a Sua Jornada de Saúde',
					description: 'Conheça a visão por trás da nossa ferramenta e como queremos ajudá-lo a atingir os seus objetivos.',
					image: 'https://caloric.com.br/assets/caloric-social-preview.png',
				},
				// --- Fim das Meta Tags Otimizadas ---
			}),
		}),
		// --- PÁGINA PRIVACIDADE ---
		new HtmlWebpackPlugin({
			filename: 'privacidade.html',
			chunks: ['main'],
			inject: 'body',
			templateContent: generateHtml('./src/privacidade.ejs', {
				title: 'Políticas de Privacidade | Caloric',
				meta: {
					description: 'Entenda nossas políticas de privacidade no app do Caloric.',
				},
				canonicalUrl: 'https://caloric.com.br/privacidade.html',
			}),
		}),
		// --- PÁGINA DE BLOG - CALCULATION ---
		new HtmlWebpackPlugin({
			filename: 'calculo.html',
			chunks: ['main'],
			inject: 'body',
			templateContent: generateHtml('./src/blog.ejs', {
				title: 'Caloric Blog - Calculation',
				article: 'calculation',
				meta: {
					description: 'Entenda como o cálculo é realizado em nosso site.',
				},
				canonicalUrl: 'https://caloric.com.br/blog/calculation.html',
			}),
		}),
		new MiniCssExtractPlugin(),
		new SitemapWebpackPlugin({
			base: 'https://caloric.com.br',
			paths,
		}),
		new CopyWebpackPlugin({
			patterns: [{ from: 'src/assets', to: 'assets' }],
		}),
	],
	devServer: {
		static: './dist',
		port: 8080,
		open: true,
		hot: true,
		watchFiles: ['src/**/*'],
		devMiddleware: {
			writeToDisk: true,
		},
	},
};
