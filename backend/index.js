// 1. Importar a ferramenta Express
const express = require('express');
const { PrismaClient } = require('@prisma/client'); // O comunicador do Prisma
const bcrypt = require('bcryptjs'); // A ferramenta de criptografia

// 2. Inicializar a aplicação Express
const app = express();
const prisma = new PrismaClient();

// 3. Adicionar um "tradutor" para o Express entender JSON
app.use(express.json());

// 3. Definir a porta onde o nosso servidor irá "ouvir"
const PORT = 3000; // Uma porta comum para desenvolvimento local

// 4. Criar a nossa primeira "rota" ou "endpoint"
// Quando alguém aceder à página inicial ('/'), esta função será executada
app.get('/', (req, res) => {
	// req = request (o pedido que chega do navegador)
	// res = response (a resposta que vamos enviar de volta)
	res.send('A API do Caloric V3 está no ar!');
});

app.post('/api/register', async (req, res) => {
	try {
		const { email, password, name } = req.body;

		if (!email || !password) {
			return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
		}

		const existingUser = await prisma.user.findUnique({
			where: { email: email },
		});

		if (existingUser) {
			return res.status(409).json({ error: 'Este e-mail já está em uso.' });
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const newUser = await prisma.user.create({
			data: {
				email: email,
				password: hashedPassword,
				name: name,
			},
		});

		const userForResponse = { ...newUser };
		delete userForResponse.password;

		res.status(201).json(userForResponse);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Ocorreu um erro ao registrar o utilizador.' });
	}
});

// --- ROTA DE LOGIN DE UTILIZADOR ---
app.post('/api/login', async (req, res) => {
	try {
		// 1. Obter os dados do pedido
		const { email, password } = req.body;

		// 2. Validação
		if (!email || !password) {
			return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
		}

		// 3. Encontrar o utilizador no banco de dados
		const user = await prisma.user.findUnique({
			where: { email: email },
		});

		// Se o utilizador não existir...
		if (!user) {
			return res.status(401).json({ error: 'Credenciais inválidas.' }); // 401 Unauthorized
		}

		// 4. Comparar a senha enviada com a senha criptografada no banco de dados
		const isPasswordValid = await bcrypt.compare(password, user.password);

		// Se a senha estiver incorreta...
		if (!isPasswordValid) {
			return res.status(401).json({ error: 'Credenciais inválidas.' });
		}

		// 5. Se tudo estiver correto, gerar o "passaporte digital" (Token JWT)
		const jwt = require('jsonwebtoken'); // Importamos a biblioteca aqui dentro
		const token = jwt.sign(
			{ userId: user.id }, // A informação que guardamos no token (o "payload")
			process.env.JWT_SECRET, // A nossa chave secreta do ficheiro .env
			{ expiresIn: '8h' } // Opções, como o tempo de expiração do token
		);

		// 6. Enviar o token de volta como resposta de sucesso
		res.status(200).json({
			message: 'Login bem-sucedido!',
			token: token,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Ocorreu um erro ao fazer o login.' });
	}
});

// --- O NOSSO MIDDLEWARE DE AUTENTICAÇÃO ---
const authenticateToken = (req, res, next) => {
	// 1. Obter o cabeçalho de autorização do pedido
	const authHeader = req.headers['authorization'];
	// O token vem no formato "Bearer TOKEN"
	const token = authHeader && authHeader.split(' ')[1];

	// 2. Se não houver token, barrar a entrada
	if (token == null) {
		return res.sendStatus(401); // 401 Unauthorized
	}

	// 3. Verificar se o token é válido
	const jwt = require('jsonwebtoken');
	jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
		// Se o token for inválido (expirado, assinatura errada)...
		if (err) {
			return res.sendStatus(403); // 403 Forbidden
		}

		// Se o token for válido, guardamos os dados do utilizador no pedido (req)
		// para que a rota final os possa usar
		req.user = user;

		// 4. Deixar o pedido passar para a próxima fase (a rota final)
		next();
	});
};

// --- ROTA PROTEGIDA PARA OBTER DADOS DO UTILIZADOR LOGADO ---
app.get('/api/me', authenticateToken, async (req, res) => {
	// Se o código chegou até aqui, significa que o nosso "segurança" (authenticateToken)
	// já verificou o token e deixou o pedido passar.

	// O middleware guardou o ID do utilizador em req.user.userId
	const userId = req.user.userId;

	try {
		const user = await prisma.user.findUnique({
			where: { id: userId },
		});

		if (!user) {
			return res.sendStatus(404); // Not Found
		}

		// Remover a senha antes de enviar a resposta
		const userForResponse = { ...user };
		delete userForResponse.password;

		res.json(userForResponse);
	} catch (error) {
		res.status(500).json({ error: 'Erro ao obter os dados do utilizador.' });
	}
});

// --- ROTA PARA SALVAR UM NOVO CÁLCULO ---
app.post('/api/calculations', authenticateToken, async (req, res) => {
	// O ID do utilizador vem do nosso middleware, através do token JWT
	const userId = req.user.userId;

	// Os dados do cálculo vêm do corpo do pedido (enviados pelo frontend)
	const {
		weight,
		height,
		age,
		gender,
		activityLevel,
		objective, // Entradas
		bmi,
		finalCalories,
		proteinGrams,
		carbsGrams,
		fatGrams, // Resultados
	} = req.body;

	// Validação simples para garantir que recebemos os dados essenciais
	if (typeof weight === 'undefined' || typeof finalCalories === 'undefined') {
		return res.status(400).json({ error: 'Dados do cálculo incompletos.' });
	}

	try {
		// Usamos o Prisma para criar um novo registo na tabela 'Calculation'
		const newCalculation = await prisma.calculation.create({
			data: {
				weight,
				height,
				age,
				gender,
				activityLevel,
				objective,
				bmi,
				finalCalories,
				proteinGrams,
				carbsGrams,
				fatGrams,
				// A ligação crucial com o utilizador que fez o cálculo!
				userId: userId,
			},
		});
		// Respondemos com o cálculo que acabámos de criar
		res.status(201).json(newCalculation);
	} catch (error) {
		console.error('Erro ao salvar cálculo: ', error);
		res.status(500).json({ error: 'Não foi possível salvar o cálculo.' });
	}
});

// --- ROTA PARA OBTER O HISTÓRICO DE CÁLCULOS ---
app.get('/api/calculations', authenticateToken, async (req, res) => {
	const userId = req.user.userId;

	try {
		// Usamos o Prisma para encontrar muitos ('findMany') registos
		const calculations = await prisma.calculation.findMany({
			where: {
				// A condição mágica: buscar apenas os cálculos onde o userId corresponde ao do nosso utilizador
				userId: userId,
			},
			orderBy: {
				// Ordenamos para que os cálculos mais recentes apareçam primeiro
				createdAt: 'desc',
			},
		});

		res.status(200).json(calculations);
	} catch (error) {
		console.error('Erro ao buscar histórico: ', error);
		res.status(500).json({ error: 'Não foi possível buscar o histórico de cálculos.' });
	}
});

// 5. Iniciar o servidor
app.listen(PORT, () => {
	console.log(`Servidor a correr em http://localhost:${PORT}`);
});
